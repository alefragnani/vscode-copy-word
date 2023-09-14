/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { commands, window, env, workspace, l10n } from "vscode";
import { selectWordAtCursorPosition } from "vscode-ext-selection";
import { Operations, PasteWordBehavior } from "./constants";

export function registerCommands() {

    function canExecuteOperation(operation: Operations): boolean {
        if (!window.activeTextEditor) {
            const operationString = l10n.t(operation)
            const message = l10n.t("Open a file first to {0} text", operationString);
            window.showInformationMessage(message);
            return false;
        }

        return true;
    }

    commands.registerCommand("copy-word.copy", async () => {
        if (!canExecuteOperation(Operations.Copy)) { return; }

        const editor = window.activeTextEditor!;

        if (selectWordAtCursorPosition(editor)) {
            await env.clipboard.writeText(editor.document.getText(editor.selection));
        } else {
            if (configuredToCopyLine())
                await commands.executeCommand("editor.action.clipboardCopyAction");
        }
    });

    commands.registerCommand("copy-word.cut", async () => {

        if (!canExecuteOperation(Operations.Cut)) { return; }

        const editor = window.activeTextEditor!;

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
        } else {
            if (configuredToCopyLine())
                await commands.executeCommand("editor.action.clipboardCutAction");
        }
    });

    commands.registerCommand("copy-word.paste", () => {

        if (!canExecuteOperation(Operations.Paste)) { return; }

        const editor = window.activeTextEditor!;
        if (editor.selection.isEmpty) {
            const key = pasteWordBehavior();
            switch (key) {
                case PasteWordBehavior.ReplaceWordAtCursor: {
                    selectWordAtCursorPosition(editor);
                    break;
                }
                case PasteWordBehavior.ReplaceWordAtCursorWhenInTheMiddleOfTheWord: {
                    const cursorPosition = editor.selection.active;
                    const cursorWordRange = editor.document.getWordRangeAtPosition(cursorPosition);
                    if (cursorWordRange?.start.isBefore(cursorPosition) && cursorPosition.isBefore(cursorWordRange.end)) {
                        selectWordAtCursorPosition(editor);
                    }
                    break;
                }
                default:
            }
        }
        commands.executeCommand("editor.action.clipboardPasteAction");
    });

    const configuredToCopyLine = () => workspace.getConfiguration('copyWord').get('useOriginalCopyBehavior');
    
    function pasteWordBehavior(): PasteWordBehavior {
        const pasteWordBehaviorAsString = workspace.getConfiguration('copyWord').get<string>('pasteWordBehavior');
        return <PasteWordBehavior>pasteWordBehaviorAsString;
    } 

}