/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { commands, window, env, TextEditor, Selection, workspace } from "vscode";
import { selectWordAtCursorPosition } from "vscode-ext-selection";
import { Operations } from "./constants";

export function registerCommands() {

    function canExecuteOperation(operation: Operations): boolean {
        if (!window.activeTextEditor) {
            window.showInformationMessage(`Open a file first to ${operation} text`);
            return false;
        }

        return true;
    }
    
    commands.registerCommand("copy-word.copy", async () => {
        if (!canExecuteOperation(Operations.Copy)) { return; }

        const editor = window.activeTextEditor!;
        if (shouldCopyLine(editor) || !(editor.selection.isEmpty)) {
            await commands.executeCommand("editor.action.clipboardCopyAction");
        } else {
            if (selectWordAtCursorPosition(editor)) {
                await env.clipboard.writeText(editor.document.getText(editor.selection));
            }
        }
    });

    commands.registerCommand("copy-word.cut", async () => {

        if (!canExecuteOperation(Operations.Cut)) { return; }

        const editor = window.activeTextEditor!;
        if (shouldCopyLine(editor) || !(editor.selection.isEmpty)) {
            await commands.executeCommand("editor.action.clipboardCutAction");
        } else {
            if (selectWordAtCursorPosition(editor)) {
                await env.clipboard.writeText(editor.document.getText(editor.selection));
                editor.edit((editBuilder) => {
                    editBuilder.delete(editor.selection);
                }).then(() => {
                    // console.log('Edit applied!');
                }, (err) => {
                    console.log("Edit rejected!");
                    console.error(err);
                });
            }			
        }		
    });

    commands.registerCommand("copy-word.paste", () => {

        if (!canExecuteOperation(Operations.Paste)) { return; }

        const editor = window.activeTextEditor!;
        if (editor.selection.isEmpty) {
            selectWordAtCursorPosition(editor);
        }
        commands.executeCommand("editor.action.clipboardPasteAction");
    });

    const shouldCopyLine = (editor: TextEditor) => (editor.selection.isEmpty) && isAtStartOfLine(editor) && configuredToCopyLine();

    const isAtStartOfLine = (editor: TextEditor) => (editor.selection.start.character == 0) && (editor.selection.end.character == 0);

    const configuredToCopyLine = () => workspace.getConfiguration('copyWord').get('cutCopyLineWhenAtMargin');
}