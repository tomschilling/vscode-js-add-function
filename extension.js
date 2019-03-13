// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')

const insertText = (val) => {
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

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate (context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "vscode-js-add-function" is now active!')

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  const insertLogStatement = vscode.commands.registerCommand('extension.addFunction', () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) { return }

    const selection = editor.selection
    const text = editor.document.getText(selection)

    text
      ? vscode.commands.executeCommand('cursorBottom')
        .then(() => {
          const logToInsert = `function ${text} {\n\n}`
          insertText(logToInsert)
        })
      : vscode.window.showInformationMessage('Please highlight function!')
  })
  context.subscriptions.push(insertLogStatement)
}
exports.activate = activate

// this method is called when your extension is deactivated
function deactivate () {}

module.exports = {
  activate,
  deactivate
}
