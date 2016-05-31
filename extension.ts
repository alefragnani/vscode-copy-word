// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
var copypaste = require('copy-paste'); 

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate() { 

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	//console.log('Congratulations, your extension "copy-word" is now active!'); 

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	vscode.commands.registerCommand('copy-word.copy', () => {
		const editor = vscode.window.activeTextEditor;
		const selection = editor.selection;
		if (selection.isEmpty) {			
			if (selectWord(editor)) {
				//vscode.commands.executeCommand("editor.action.clipboardCopyAction");
				copypaste.copy(editor.document.getText(editor.selection));
			}			
		} else {
			vscode.commands.executeCommand("editor.action.clipboardCopyAction");
		}		
	});
	
	vscode.commands.registerCommand('copy-word.cut', () => {
		const editor = vscode.window.activeTextEditor;
		const selection = editor.selection;
		if (selection.isEmpty) {			
			if (selectWord(editor)) {
				//vscode.commands.executeCommand("editor.action.clipboardCutAction");
				copypaste.copy(editor.document.getText(editor.selection));
				editor.edit((editBuilder) => {
					editBuilder.delete(editor.selection);
				}).then(() => {
					//console.log('Edit applied!');
				}, (err) => {
					console.log('Edit rejected!');
					console.error(err);
				});
				
			}			
		} else {
			vscode.commands.executeCommand("editor.action.clipboardCutAction");
		}		
	});
	
	function getSelectedTextOrCursorWord(editor: vscode.TextEditor): string {
		const selection = editor.selection;
		const doc = editor.document;
		if (selection.isEmpty) {
			const cursorWordRange = doc.getWordRangeAtPosition(selection.active);
			return cursorWordRange ?
				doc.getText(cursorWordRange) :
				'';
		} else {
			return doc.getText(selection);
		}
	}
	
	function selectWord(editor: vscode.TextEditor): boolean {
		const selection = editor.selection;
		const doc = editor.document;
		if (selection.isEmpty) {
			const cursorWordRange = doc.getWordRangeAtPosition(selection.active);
			
			if (typeof cursorWordRange != 'undefined') {
				var newSe = new vscode.Selection(cursorWordRange.start.line, cursorWordRange.start.character, cursorWordRange.end.line, cursorWordRange.end.character);
				editor.selection = newSe;
				return true;
				
			} else {
				return false;
			}
		} else {
			return true;
		}
	}

}