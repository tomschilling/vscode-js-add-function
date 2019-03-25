
const vscode = require('vscode')

module.exports = {
  activate
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate (context) {
  const insertLogStatement = vscode.commands.registerCommand('extension.addFunction', () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) { return }
    const selection = editor.selection
    const fileString = editor.document.getText()
    const text = editor.document.getText(selection)

    if (text) {
      if (fileString.includes('ampersand')) {
        const fileStringArray = editor._documentData._lines
        _addAmpersandFunc(fileStringArray, text)
      } else {
        _addFunc(text)
      }
    } else {
      vscode.window.showInformationMessage('Please select function!')
    }
  })
  context.subscriptions.push(insertLogStatement)
}

function _addFunc (text) {
  vscode.commands.executeCommand('cursorBottom')
    .then(() => {
      vscode.commands.executeCommand('editor.action.insertLineAfter')
        .then(() => {
          const func = text.replace('(', ' (')
          const funcToInsert = `\nfunction ${func} {\n\n}`
          _insertFunc(funcToInsert)
        })
    })
}

/**
 * Insert the selected function with a new line at the end of the file
 * @param {String} val
 */
function _insertFunc (val) {
  const editor = vscode.window.activeTextEditor

  if (!editor) {
    vscode.window.showErrorMessage('Can\'t insert function because no document is open')
    return
  }

  const selection = editor.selection
  const range = new vscode.Range(selection.start, selection.end)
  editor.edit((editBuilder) => {
    editBuilder.replace(range, val)
  })
}

/**
 * Adds a function to the PENULTIMATE position
 * @param {String} filePath
 * @param {String} newFunction
 */
function _addAmpersandFunc (fileStringArray, text) {
  const lastFunctionIndex = getLastFunctionIndex(fileStringArray)
  if (lastFunctionIndex) {
    const editor = vscode.window.activeTextEditor

    if (!editor) {
      vscode.window.showErrorMessage('Can\'t insert function because no document is open')
      return
    }

    const usedWhiteSpaces = getUsedWhiteSpaces(fileStringArray[lastFunctionIndex])
    const funcArr = text.split('(')
    const funcToInsert = usedWhiteSpaces + '},' +
      usedWhiteSpaces + '\n' +
      usedWhiteSpaces + funcArr[0] + ': function (' + funcArr[1] + ' {\n\t\n'

    const position = new vscode.Position(lastFunctionIndex, 0)

    editor.edit((editBuilder) => {
      editBuilder.replace(position, funcToInsert)
    })

    let range = editor.document.lineAt(lastFunctionIndex + 2).range
    editor.selection = new vscode.Selection(range.start, range.end)
    editor.revealRange(range)

    vscode.commands.executeCommand('editor.action.format')
  }
}

function getLastFunctionIndex (fileStringArray) {
  const lastFunctionKeyword = '},'
  let lastFunctionIndex = -1
  for (let k = 0; k < fileStringArray.length; k++) {
    if (fileStringArray[k].includes(lastFunctionKeyword)) {
      lastFunctionIndex = k
    }
  }
  if (lastFunctionIndex > -1) return lastFunctionIndex
}

/**
 * Get the used white spaces from a input string
 * @param {String} codeLine
 * @returns {String} whiteSpaceArray.join('') - A String of white spaces
 */
function getUsedWhiteSpaces (codeLine) {
  var numberOfWhiteSpaces = 0
  var index = 0
  while (codeLine.charAt(index++) === ' ') {
    numberOfWhiteSpaces++
  }

  let whiteSpaceArray = []

  for (let ws = 0; ws < numberOfWhiteSpaces; ws++) {
    whiteSpaceArray[ws] = ' '
  }

  return whiteSpaceArray.join('')
}
