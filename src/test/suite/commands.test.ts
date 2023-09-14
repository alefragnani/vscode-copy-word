/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as assert from 'assert';
import * as sinon from 'sinon';
import { setupTestSuite, teardownTestSuite } from '../setupTests';
import { Operations } from '../../constants';

type PACKAGE_NAME = 'copy-word';
type CommandsType = `${Operations}`;
type Commands = `${PACKAGE_NAME}.${CommandsType}`;

type Public<T> = { [K in keyof T]: T[K] };

class CommandTestHelper {
    doc!: vscode.TextDocument;
    static fileCopys = new Set<string>();
    async open(name = 'test2.md') {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-assertion
        const workspaceUri = vscode.workspace.workspaceFolders![0]!.uri;
        const filename = vscode.Uri.joinPath(workspaceUri, 'test.md');
        const filename2 = vscode.Uri.joinPath(workspaceUri, name);
        CommandTestHelper.fileCopys.add(filename2.toString());
        await vscode.workspace.fs.copy(filename, filename2, { overwrite: true });
        const doc = await vscode.workspace.openTextDocument(filename2);
        this.doc = doc;
        const originalDoc = await vscode.workspace.openTextDocument(filename);
        const editor = await vscode.window.showTextDocument(this.doc);
        const originalText = originalDoc.getText();
        if (originalText !== doc.getText()) {
            // sometimes not same, fix it
            await editor.edit((builder) => {
                builder.replace(new vscode.Range(0, 0, 1e4, 1e4), originalText);
            });
        }
        assert.strictEqual(originalText, doc.getText(), 'file copy content should same to original');
        return this.api();
    }
    static async clean() {
        await vscode.commands.executeCommand('workbench.action.closeAllGroups');
        const autoSave = vscode.workspace.getConfiguration('files').get<string>('autoSave');
        if (autoSave !== 'off') {
            // avoid deleted file appear again
            await vscode.workspace.getConfiguration('files').update('autoSave', 'off');
        }
        for (const file of this.fileCopys) {
            await vscode.workspace.fs.delete(vscode.Uri.parse(file));
        }
        this.fileCopys.clear();
        if (autoSave !== 'off') {
            await vscode.workspace.getConfiguration('files').update('autoSave', autoSave);
        }
    }

    rangeOfWord(word: string) {
        for (let index = 0; index < this.doc.lineCount; index++) {
            const startColumn = this.doc.lineAt(index).text.indexOf(word);
            if (startColumn > -1) {
                return new vscode.Range(new vscode.Position(index, startColumn), new vscode.Position(index, startColumn + word.length));
            }
        }
        throw new Error(`can not find word ${word}\n${this.doc.getText()}`);
    }
    putCursorAtWord(word: string | vscode.Range, offset: 'start' | 'end' | 'middle' | number) {
        const range = typeof word === 'string' ? this.rangeOfWord(word) : word;
        const positionWithOffset = (range: vscode.Range) => {
            if (typeof offset === 'number') {

                return range.start.with({ character: (offset >= 0) ? range.start.character + offset : range.end.character + offset });
            } else {
                switch (offset) {
                    case 'start':
                        return range.start;
                    case 'end':
                        return range.end;
                    case 'middle':
                        return range.start.with({ character: Math.floor((range.start.character + range.end.character) / 2) });
                }
            }
        };
        const position: vscode.Position = positionWithOffset(range);
        const sel = new vscode.Selection(position, position);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-assertion
        vscode.window.activeTextEditor!.selection = sel;

    }
    async copyWord(word: string) {
        // put the cursor at the  word 
        this.putCursorAtWord(word, 'start');

        // runs the command, copy `thank` word
        await this.runCommand('copy-word.copy');
    }

    private config = vscode.workspace.getConfiguration('copyWord');
    get useOriginalCopyBehavior() {
        return this.config.get<boolean>('useOriginalCopyBehavior');
    }
    async setUseOriginalCopyBehavior(value: boolean) {
        await this.config.update('useOriginalCopyBehavior', value);
    }
    get pasteWordBehavior() {
        return this.config.get<string>('pasteWordBehavior');
    }
    async setPasteWordBehavior(value: string) {
        await this.config.update('pasteWordBehavior', value);
    }
    async runCommand(cmd: Commands, settings?: {
        useOriginalCopyBehavior?: boolean,
        pasteWordBehavior?: string,
    }) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (settings?.useOriginalCopyBehavior) {
            await this.setUseOriginalCopyBehavior(settings.useOriginalCopyBehavior);
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (settings?.pasteWordBehavior) {
            await this.setPasteWordBehavior(settings.pasteWordBehavior);
        }
        await vscode.commands.executeCommand(cmd);
    }
    async getWordAtPosition(position: vscode.Position, timeout = 500) {
        // wait paste finish
        await new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`Promise timed out after ${timeout} ms`));
            }, timeout);
            const dispose = vscode.workspace.onDidChangeTextDocument((event) => {
                clearTimeout(timer);
                resolve(event);
                dispose.dispose();
            });
        });
        const textRange = this.doc.getWordRangeAtPosition(position);
        return this.doc.getText(textRange);
    }
    getLineAtPosition(position: vscode.Position) {
        return this.doc.lineAt(position.line).text;
    }
    async setClipboard(value: string) {
        await vscode.env.clipboard.writeText(value);
    }

    private api(): Omit<Public<CommandTestHelper>, 'open'> {
        const that = this as CommandTestHelper;
        return {
            /* eslint-disable @typescript-eslint/no-unsafe-assignment*/
            doc: that.doc,
            rangeOfWord: that.rangeOfWord.bind(that),
            putCursorAtWord: that.putCursorAtWord.bind(that),
            get useOriginalCopyBehavior() { return that.useOriginalCopyBehavior; },
            async setUseOriginalCopyBehavior(value: boolean) {
                await that.setUseOriginalCopyBehavior(value);
            },
            get pasteWordBehavior() { return that.pasteWordBehavior; },
            async setPasteWordBehavior(value: string) {
                await that.setPasteWordBehavior(value);
            },
            runCommand: that.runCommand.bind(that),
            copyWord: that.copyWord.bind(that),
            getWordAtPosition: that.getWordAtPosition.bind(that),
            getLineAtPosition: that.getLineAtPosition.bind(that),
            setClipboard: that.setClipboard.bind(that)
            /* eslint-enable @typescript-eslint/no-unsafe-assignment*/
        };
    }
}

suite('Copy Command Test Suite', () => {

    const originalValue = {};
    suiteSetup(async () => await setupTestSuite(originalValue));
    suiteTeardown(async () => {
        await teardownTestSuite(originalValue);
        await CommandTestHelper.clean();
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

    test('will override text when cursor in word sides (when "pasteWordBehavior" is "replaceWordAtCursor")', async () => {
        const helper = new CommandTestHelper();
        await helper.setClipboard('thank');
        const tests: [Parameters<CommandTestHelper['putCursorAtWord']>[1], string][] = [
            ['start', 'thank'],
            ['end', 'thank'],
            ['middle', 'thank']
        ];
        for (const [position, result] of tests) {
            // opens a file
            const { putCursorAtWord, runCommand, rangeOfWord, getWordAtPosition, getLineAtPosition } = await helper.open();
            const you = rangeOfWord('you');
            // put the cursor at the left/right/middle side of `you` word
            putCursorAtWord(you, position);

            // runs the command, paste `thank` word, (with the required setting)
            await runCommand('copy-word.paste', { pasteWordBehavior: "replaceWordAtCursor" });

            // get the text at the position
            const text = await getWordAtPosition(you.start);

            // should all be `thank`
            assert.strictEqual(text, result, `paste at ${position} side\n\t${getLineAtPosition(you.start)}`);
        }
    });

    test('will not override text when cursor in word sides (when "pasteWordBehavior" is "replaceWordAtCursorWhenInTheMiddleOfTheWord")', async () => {
        const helper = new CommandTestHelper();
        await helper.setClipboard('thank');
        const tests: [Parameters<CommandTestHelper['putCursorAtWord']>[1], string][] = [
            ['start', 'thankyou'],
            ['end', 'youthank'],
            ['middle', 'thank']
        ];
        for (const [position, result] of tests) {
            // opens a file
            const { putCursorAtWord, runCommand, rangeOfWord, getWordAtPosition, getLineAtPosition } = await helper.open();
            const you = rangeOfWord('you');
            // put the cursor at the left/right/middle side of `you` word
            putCursorAtWord(you, position);

            // runs the command, paste `thank` word, (with the required setting)
            await runCommand('copy-word.paste', { pasteWordBehavior: "replaceWordAtCursorWhenInTheMiddleOfTheWord" });

            // get the text at the position
            const text = await getWordAtPosition(you.start);

            // should all be `thank` only when middle
            assert.strictEqual(text, result, `paste at ${position} side\n\t${getLineAtPosition(you.start)}`);
        }
    });

    test('will paste the text in the position (when "pasteWordBehavior" is "default")', async () => {
        const helper = new CommandTestHelper();
        await helper.setClipboard('thank');
        const tests: [Parameters<CommandTestHelper['putCursorAtWord']>[1], string][] = [
            ['start', 'thankyou'],
            ['end', 'youthank'],
            ['middle', 'ythankou']
        ];
        for (const [position, result] of tests) {
            // opens a file
            const { putCursorAtWord, runCommand, rangeOfWord, getWordAtPosition, getLineAtPosition } = await helper.open();
            const you = rangeOfWord('you');
            // put the cursor at the left/right/middle side of `you` word
            putCursorAtWord(you, position);

            // runs the command, paste `thank` word, (with the required setting)
            await runCommand('copy-word.paste', { pasteWordBehavior: "default" });

            // get the text at the position
            const text = await getWordAtPosition(you.start);

            // should all be `thank` only when middle
            assert.strictEqual(text, result, `paste at ${position} side\n\t${getLineAtPosition(you.start)}`);
        }
    });
});