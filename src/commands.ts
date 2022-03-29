/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { commands, window, env } from "vscode";
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

    commands.registerCommand("copy-word.copy", () => {

        if (!canExecuteOperation(Operations.Copy)) { return; }

        const editor = window.activeTextEditor!;
        if (editor.selection.isEmpty) {
            if (selectWordAtCursorPosition(editor)) {
                env.clipboard.writeText(editor.document.getText(editor.selection));
            }
        } else {
            commands.executeCommand("editor.action.clipboardCopyAction");
        }
    });

    commands.registerCommand("copy-word.cut", async () => {

        if (!canExecuteOperation(Operations.Cut)) { return; }

        const editor = window.activeTextEditor!;
        if (editor.selection.isEmpty) {
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
        } else {
            commands.executeCommand("editor.action.clipboardCutAction");
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

}