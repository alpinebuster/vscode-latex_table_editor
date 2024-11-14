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
				retainContextWhenHidden: true, // The webview remains state when hidden to avoid being reset
			} // webview options
        );

		panel.webview.html = getWebViewContent(context, 'latex_table_editor/index.html');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function getWebViewContent(context: vscode.ExtensionContext, templatePath: string) {
    const resourcePath = path.join(context.extensionPath, templatePath);
    const dirPath = path.dirname(resourcePath);
    let html = fs.readFileSync(resourcePath, 'utf-8');
    // VSCode does not support direct loading of local resources,
	// need to be replaced with its proprietary path format,
	// here is simply to replace the style and JS path
    html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
        return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
	});

    return html;
}
