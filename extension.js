
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
    const text = editor.document.getText(selection)

    if (text) {
      vscode.commands.executeCommand('cursorBottom')
        .then(() => {
          vscode.commands.executeCommand('editor.action.insertLineAfter')
            .then(() => {
              const func = text.replace('(', ' (')
              const funcToInsert = `\nfunction ${func} {\n\n}`
              _insertFunc(funcToInsert)
            })
        })
    } else {
      vscode.window.showInformationMessage('Please select function!')
    }
  })
  context.subscriptions.push(insertLogStatement)
}

/**
 * Insert the selected function with a new line at the end of the file
 * @param {String} val
 */
function _insertFunc (val) {
  const editor = vscode.window.activeTextEditor

  if (!editor) {
    vscode.window.showErrorMessage('Can\'t insert log because no document is open')
    return
  }

  const selection = editor.selection
  const range = new vscode.Range(selection.start, selection.end)

  editor.edit((editBuilder) => {
    editBuilder.replace(range, val)
  })
}
