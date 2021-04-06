import { commands, window } from "vscode";

export function activateProFeatures() {
    commands.registerCommand("copy-word.cut", async () => {
        window.showInformationMessage('proFeatures enabled');
    });
}