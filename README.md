# Functionality

Replaces the default Copy/Cut commands, and uses the current word when no text is selected.

* `Ctrl-C` / `Cmd-C` - copy the current word
* `Ctrl-X` / `Cmd-X` - cut the current word

# Usage

### Availble commands

![Commands](images/copy-word-commands.png)

After installing the extension, 

### Using as your default shortcuts

You only need to update your **Keyboard Shortcuts**. 

Go to `File / Preferences / Keyboard Shortcuts` and add two new entries:

### Windows/Linux
```
    { "key": "Ctrl+c",          "command": "copy-word.copy" },
    { "key": "Ctrl+x",          "command": "copy-word.cut" }
```
### Mac
```
    { "key": "Cmd+c",          "command": "copy-word.copy" },
    { "key": "Cmd+x",          "command": "copy-word.cut" }
```

# Known Issues

**None :)**