
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
    const fileStringArray = editor._documentData._lines
    const text = editor.document.getText(selection)

    if (text) {
      const context = checkContext(fileStringArray)
      if (context.isObjectMethod) {
        _addObjectFunc(fileStringArray, text, context)
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
 * Adds a function to the last position in object
 * @param {String} filePath
 * @param {String} newFunction
 */
function _addObjectFunc (fileStringArray, text, context) {
  const lastFunctionIndex = context.endIndex - 2
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

/**
 * Checks if context is whether in object or not
 * @param {String} filePath
 * @param {String} newFunction
 */
function checkContext (fileStringArray) {
  for (let i = 0; i < fileStringArray.length; i++) {
    const codeLine = fileStringArray[i]
    var lastChar = codeLine[codeLine.length - 1]
    if (lastChar === '{') {
      const beginIndex = i
      const endIndex = _getEndOfFunction(fileStringArray, beginIndex, '{', '}')
      const editor = vscode.window.activeTextEditor
      const position = editor.selection.active
      if (beginIndex < position.line && endIndex > position.line) {
        return { isObjectMethod: true, endIndex: endIndex }
      }
      return { isObjectMethod: false }
    }
  }
}

/**
 * Gets the code line index of the function or array
 * @param {Array} fileStringArray
 * @param {Number} codeLineIndex
 * @param {String} startDelimiter
 * @param {String} endDelimiter
 * @returns {Number} codeLineIndex- The code line index from the end of function or array
 */
function _getEndOfFunction (fileStringArray, codeLineIndex, startDelimiter, endDelimiter) {
  let braceLeftCount = 0
  let braceRightCount = 0

  while (!fileStringArray[codeLineIndex].includes(endDelimiter)) {
    if (fileStringArray[codeLineIndex].includes(startDelimiter)) {
      braceLeftCount++
    }
    codeLineIndex++
  }
  while (braceLeftCount !== braceRightCount) {
    if (fileStringArray[codeLineIndex].includes(startDelimiter)) {
      braceLeftCount++
    }
    if (fileStringArray[codeLineIndex].includes(endDelimiter)) {
      braceRightCount++
    }
    codeLineIndex++
  }
  return codeLineIndex
}
