/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as assert from 'assert';

suite('Copy Command Test Suite', () => {
    
    // suiteSetup(() => 
    // );

    test('can copy word', async () => {
        // opens a file
        const filename = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'test.md');
        const doc = await vscode.workspace.openTextDocument(filename);
        await vscode.window.showTextDocument(doc);

        // put the cursor at the `thank` word 
        const sel = new vscode.Selection(new vscode.Position(2, 16), new vscode.Position(2, 16));
        vscode.window.activeTextEditor.selection = sel;
        
        // runs the command
        await vscode.commands.executeCommand('copy-word.copy');

        // get the newly selected text
        const currentSelection = vscode.window.activeTextEditor.selection;
        const newRange = new vscode.Range(currentSelection.start, currentSelection.end);
        const text = vscode.window.activeTextEditor.document.getText(newRange);

        // assert - the new select must be `thank`
        assert.ok(text === 'thank');
    });

    test('can copy word using original selection', async () => {
        // opens a file
        const filename = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'test.md');
        const doc = await vscode.workspace.openTextDocument(filename);
        await vscode.window.showTextDocument(doc);

        // put the cursor at the `thank` word 
        const sel = new vscode.Selection(new vscode.Position(2, 16), new vscode.Position(2, 18));
        vscode.window.activeTextEditor.selection = sel;
        
        // runs the command
        await vscode.commands.executeCommand('copy-word.copy');

        // get the newly selected text
        const currentSelection = vscode.window.activeTextEditor.selection;

        const newRange = new vscode.Range(currentSelection.start, currentSelection.end);
        const text = vscode.window.activeTextEditor.document.getText(newRange);

        // assert - the new selection (after the copy command) may not change
        assert.ok(currentSelection.start.character === sel.start.character);
        assert.ok(currentSelection.start.line === sel.start.line);
        assert.ok(currentSelection.end.character === sel.end.character);
        assert.ok(currentSelection.end.line === sel.end.line);

        // assert - the new select must be `ha`
        assert.ok(text === 'ha');
    });

    test('cannot copy word on empty space', async () => {
        // opens a file
        const filename = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'test.md');
        const doc = await vscode.workspace.openTextDocument(filename);
        await vscode.window.showTextDocument(doc);

        // put the cursor at an empty line
        const sel = new vscode.Selection(new vscode.Position(3, 0), new vscode.Position(3, 0));
        vscode.window.activeTextEditor.selection = sel;
        
        // runs the command
        await vscode.commands.executeCommand('copy-word.copy');

        // get the newly selected text (which must be empty)
        const currentSelection = vscode.window.activeTextEditor.selection;
        const newRange = new vscode.Range(currentSelection.start, currentSelection.end);
        const text = vscode.window.activeTextEditor.document.getText(newRange);

        // assert - the new select must be `thank`
        assert.ok(text === '');
    });
});