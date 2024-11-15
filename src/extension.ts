// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from "fs";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-latex-table-editor" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('vscode-latex-table-editor.start', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
        const panel = vscode.window.createWebviewPanel(
            'lteWebview', // Identify the type of webview
            'Latex Table Editor', // title
            vscode.ViewColumn.One, // Which column appears in the editor
			{
				enableScripts: true, // Enable JS, disabled by default
				// And restrict the webview to only loading content from our extension's `media` directory.
				localResourceRoots: [
					vscode.Uri.joinPath(context.extensionUri, 'latex_table_editor')
				]
			} // webview options
        );

		panel.webview.html = _getHtmlForWebview(context, panel.webview);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function _getHtmlForWebview(context: vscode.ExtensionContext, webview: vscode.Webview): string {
	const templatePath = vscode.Uri.file(
		path.join(context.extensionPath, 'latex_table_editor', 'index.html')
	);
	const pathUri = templatePath.with({ scheme: 'vscode-resource' });  

	let raw = fs.readFileSync(pathUri.fsPath, 'utf8');
	const htmlContent = raw.replace(/(<a.+?href="|<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
		if ($2.startsWith('https://')) {
			return m;
		} else {
			const x = vscode.Uri.file(path.resolve(path.dirname(pathUri.fsPath), $2));
			return $1 + webview.asWebviewUri(x).toString() + '"';
		}
	});
	console.log(htmlContent);
	return htmlContent;
}
