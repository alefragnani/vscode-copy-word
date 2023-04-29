/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export async function setupTestSuite(originalValues) {
    originalValues.useOriginalCopyBehavior = vscode.workspace.getConfiguration("copyWord").get<boolean>("useOriginalCopyBehavior", false);

    await vscode.workspace.getConfiguration('copyWord').update('useOriginalCopyBehavior', false);

    originalValues.overwriteWordBehavior = vscode.workspace.getConfiguration("copyWord").get<boolean>("overwriteWordBehavior", false);

    await vscode.workspace.getConfiguration('copyWord').update('overwriteWordBehavior', false);
}

export async function teardownTestSuite(originalValues) {
    await vscode.workspace.getConfiguration('copyWord').update('useOriginalCopyBehavior', originalValues.useOriginalCopyBehavior);
    await vscode.workspace.getConfiguration('copyWord').update('overwriteWordBehavior', originalValues.overwriteWordBehavior);
}
