/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export async function setupTestSuite(originalValues) {
    originalValues.useOriginalCopyBehavior = vscode.workspace.getConfiguration("copyWord").get<boolean>("useOriginalCopyBehavior", false);

    await vscode.workspace.getConfiguration('copyWord').update('useOriginalCopyBehavior', false);

    originalValues.pasteWordBehavior = vscode.workspace.getConfiguration("copyWord").get<string>("pasteWordBehavior", "replaceWordAtCursor");

    await vscode.workspace.getConfiguration('copyWord').update('pasteWordBehavior', "replaceWordAtCursor");
}

export async function teardownTestSuite(originalValues) {
    await vscode.workspace.getConfiguration('copyWord').update('useOriginalCopyBehavior', originalValues.useOriginalCopyBehavior);
    await vscode.workspace.getConfiguration('copyWord').update('pasteWordBehavior', originalValues.pasteWordBehavior);
}
