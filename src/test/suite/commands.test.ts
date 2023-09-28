/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as assert from 'assert';
import * as sinon from 'sinon';
import { setupTestSuite, teardownTestSuite } from '../setupTests';

const timeout = async (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

suite('Copy Command Test Suite', () => {

    const originalValue = {};
    suiteSetup(async () => await setupTestSuite(originalValue));
    suiteTeardown(async () => {
        await teardownTestSuite(originalValue);
    });

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

    test('can copy word using original behavior when no text is selected and no current word is defined', async () => {
        // opens a file
        const filename = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'test.md');
        const doc = await vscode.workspace.openTextDocument(filename);
        await vscode.window.showTextDocument(doc);

        // put the cursor at the end of the line (so no word is currently selected/focused)
        const lineLength = 999;
        const sel = new vscode.Selection(new vscode.Position(2, lineLength), new vscode.Position(2, lineLength));
        vscode.window.activeTextEditor.selection = sel;

        // runs the command (with the required setting)
        await vscode.workspace.getConfiguration('copyWord').update('useOriginalCopyBehavior', true);
        await vscode.commands.executeCommand('copy-word.copy');
        await vscode.workspace.getConfiguration('copyWord').update('useOriginalCopyBehavior', false);

        // get the newly selected text
        const textInClipboard = await vscode.env.clipboard.readText();
        const lineText = vscode.window.activeTextEditor.document.lineAt(2).text;

        // assert - the text copied to the clipboard must be the entire line
        assert.ok(lineText.trim() === textInClipboard.trim());
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

    test('cannot copy word if no file is open', async () => {
        // closes all files
        await vscode.commands.executeCommand('workbench.action.closeAllEditors');

        const mock = sinon.mock(vscode.window);
        const expectation = mock.expects("showInformationMessage");

        // runs the command
        await vscode.commands.executeCommand('copy-word.copy');

        mock.restore();

        assert(expectation.calledOnce);
    });

    test('paste text with "pasteWordBehavior" as "original"', async () => {
        // opens a file
        const filename = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'test.md');
        const doc = await vscode.workspace.openTextDocument(filename);
        await vscode.window.showTextDocument(doc);

        // put some text in the clipboard
        await vscode.env.clipboard.writeText('thank');

        // put the cursor at the `taking'
        const selDestiny = new vscode.Selection(new vscode.Position(2, 31), new vscode.Position(2, 31));
        vscode.window.activeTextEditor.selection = selDestiny;

        // runs the command
        await vscode.workspace.getConfiguration('copyWord').update('pasteWordBehavior', 'original');
        await vscode.commands.executeCommand('copy-word.paste');
        await vscode.workspace.getConfiguration('copyWord').update('pasteWordBehavior', 'replaceWordAtCursor');

        // get the word at the position of the paste
        const text = vscode.window.activeTextEditor.document.getText(
            vscode.window.activeTextEditor.document.getWordRangeAtPosition(vscode.window.activeTextEditor.selection.active));

        await vscode.commands.executeCommand('undo');

        // assert - the new select must be `tathankking`
        assert.ok(text === 'tathankking');
    });

    test('paste text with "pasteWordBehavior" as "replaceAtCursor"', async () => {
        // closes all files
        await vscode.commands.executeCommand('workbench.action.closeAllEditors');

        // opens a file
        const filename = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'test.md');
        const doc = await vscode.workspace.openTextDocument(filename);
        await vscode.window.showTextDocument(doc);

        // put some text in the clipboard
        await vscode.env.clipboard.writeText('thank');

        // put the cursor at the `taking'
        const selDestiny = new vscode.Selection(new vscode.Position(2, 31), new vscode.Position(2, 31));
        vscode.window.activeTextEditor.selection = selDestiny;

        // runs the command
        await vscode.workspace.getConfiguration('copyWord').update('pasteWordBehavior', 'replaceWordAtCursor');
        await vscode.commands.executeCommand('copy-word.paste');
        await vscode.workspace.getConfiguration('copyWord').update('pasteWordBehavior', 'replaceWordAtCursor');

        // get the word at the position of the paste
        const text = vscode.window.activeTextEditor.document.getText(
            vscode.window.activeTextEditor.document.getWordRangeAtPosition(vscode.window.activeTextEditor.selection.active));

        await vscode.commands.executeCommand('undo');

        // assert - the new select must be `thank`
        assert.ok(text === 'thank');
    });    

    test('paste text with "pasteWordBehavior" as "replaceWordAtCursorWhenInTheMiddleOfTheWord" at the END', async () => {
        // closes all files
        await vscode.commands.executeCommand('workbench.action.closeAllEditors');

        // opens a file
        const filename = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'test.md');
        const doc = await vscode.workspace.openTextDocument(filename);
        await vscode.window.showTextDocument(doc);

        // put some text in the clipboard
        await vscode.env.clipboard.writeText('thank');

        // configure the behavior
        await vscode.workspace.getConfiguration('copyWord').update('pasteWordBehavior', 'replaceWordAtCursorWhenInTheMiddleOfTheWord');

        // put the cursor at the `please' (end)
        const selDestinyEnd = new vscode.Selection(new vscode.Position(4, 41), new vscode.Position(4, 41));
        vscode.window.activeTextEditor.selection = selDestinyEnd;

        // runs the command
        await vscode.commands.executeCommand('copy-word.paste');
        await timeout(1500);
        
        // get the word at the position of the paste
        const textEnd = vscode.window.activeTextEditor.document.getText(
            vscode.window.activeTextEditor.document.getWordRangeAtPosition(vscode.window.activeTextEditor.selection.active));

        // restore the original text
        await vscode.commands.executeCommand('undo');

        // assert - the new select must be 
        assert.ok(textEnd === 'pleasethank');

        // restore the behavior
        await vscode.workspace.getConfiguration('copyWord').update('pasteWordBehavior', 'replaceWordAtCursor');
    });    

    test.skip('paste text with "pasteWordBehavior" as "replaceWordAtCursorWhenInTheMiddleOfTheWord" in the MIDDLE', async () => {
        // closes all files
        await vscode.commands.executeCommand('workbench.action.closeAllEditors');

        // opens a file
        const filename = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'test.md');
        const doc = await vscode.workspace.openTextDocument(filename);
        await vscode.window.showTextDocument(doc);

        // put some text in the clipboard
        await vscode.env.clipboard.writeText('thank');

        // configure the behavior
        await vscode.workspace.getConfiguration('copyWord').update('pasteWordBehavior', 'replaceWordAtCursorWhenInTheMiddleOfTheWord');

        // put the cursor at the `taking' (middle)
        const selDestinyMiddle = new vscode.Selection(new vscode.Position(2, 31), new vscode.Position(2, 31));
        vscode.window.activeTextEditor.selection = selDestinyMiddle;

        // runs the command
        await vscode.commands.executeCommand('copy-word.paste');
        await timeout(1500);
        
        // get the word at the position of the paste
        const textMiddle = vscode.window.activeTextEditor.document.getText(
            vscode.window.activeTextEditor.document.getWordRangeAtPosition(vscode.window.activeTextEditor.selection.active));
            
        // restore the original text
        await vscode.commands.executeCommand('undo');

        // assert - the new select must be 
        assert.ok(textMiddle === 'thank');

        // restore the behavior
        await vscode.workspace.getConfiguration('copyWord').update('pasteWordBehavior', 'replaceWordAtCursor');
    });    

    test.skip('paste text with "pasteWordBehavior" as "replaceWordAtCursorWhenInTheMiddleOfTheWord" at the START', async () => {
        // closes all files
        await vscode.commands.executeCommand('workbench.action.closeAllEditors');

        // opens a file
        const filename = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'test.md');
        const doc = await vscode.workspace.openTextDocument(filename);
        await vscode.window.showTextDocument(doc);

        // put some text in the clipboard
        await vscode.env.clipboard.writeText('thank');

        // configure the behavior
        await vscode.workspace.getConfiguration('copyWord').update('pasteWordBehavior', 'replaceWordAtCursorWhenInTheMiddleOfTheWord');

        // put the cursor at the `contributing' (start)
        const selDestinyStart = new vscode.Selection(new vscode.Position(4, 5), new vscode.Position(4, 5));
        vscode.window.activeTextEditor.selection = selDestinyStart;

        // runs the command
        await vscode.commands.executeCommand('copy-word.paste');
        await timeout(1500);
        
        // get the word at the position of the paste
        const textStart = vscode.window.activeTextEditor.document.getText(
            vscode.window.activeTextEditor.document.getWordRangeAtPosition(vscode.window.activeTextEditor.selection.active));

            
        // restore the original text
        await vscode.commands.executeCommand('undo');

        // assert - the new select must be 
        assert.ok(textStart === 'thankcontributing');

        // restore the behavior
        await vscode.workspace.getConfiguration('copyWord').update('pasteWordBehavior', 'replaceWordAtCursor');
    });    

});