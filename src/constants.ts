/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

export const enum Operations {
    Copy = "copy",
    Cut = "cut",
    Paste = "paste"
}

export const enum PasteWordBehavior {
    Original = "original",
    ReplaceWordAtCursor = "replaceWordAtCursor",
    ReplaceWordAtCursorWhenInTheMiddleOfTheWord = "replaceWordAtCursorWhenInTheMiddleOfTheWord"
}