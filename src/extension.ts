/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { selectWordAtCursorPosition } from "vscode-ext-selection";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate() { 

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    vscode.commands.registerCommand("copy-word.copy", () => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
          vscode.window.showInformationMessage("Open a file first to copy text");
          return;
        }

        const selection = editor.selection;
        if (selection.isEmpty) {
            if (selectWordAtCursorPosition(editor)) {
                vscode.env.clipboard.writeText(editor.document.getText(editor.selection));
            }
        } else {
            vscode.commands.executeCommand("editor.action.clipboardCopyAction");
        }
    });
    
    vscode.commands.registerCommand("copy-word.cut", () => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
          vscode.window.showInformationMessage("Open a file first to cut text");
          return;
        }

        const selection = editor.selection;
        if (selection.isEmpty) {			
            if (selectWordAtCursorPosition(editor)) {
                vscode.env.clipboard.writeText(editor.document.getText(editor.selection));
                editor.edit((editBuilder) => {
                    editBuilder.delete(editor.selection);
                }).then(() => {
                    // console.log('Edit applied!');
                }, (err) => {
                    console.log("Edit rejected!");
                    console.error(err);
                });
                
            }			
        } else {
            vscode.commands.executeCommand("editor.action.clipboardCutAction");
        }		
    });
}