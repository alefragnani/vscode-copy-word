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
    { 
      "key": "Ctrl+c",          
      "command": "copy-word.copy",
      "when": "editorTextFocus"      
    },
    { 
      "key": "Ctrl+x",          
      "command": "copy-word.cut",
      "when": "editorTextFocus" 
    }
```
### Mac
```
    { 
      "key": "Cmd+c",          
      "command": "copy-word.copy",
      "when": "editorTextFocus" 
    },
    { 
      "key": "Cmd+x",          
      "command": "copy-word.cut",
      "when": "editorTextFocus" 
    }
```

# Changelog

## Version 0.3.1

* Updated `Keyboard Shortcuts` example in `README.md`

## Version 0.3.0

* **Fix:** Stopped working with Code 1.1.0 (issue [#3](https://github.com/alefragnani/vscode-copy-word/issues/3))

## Version 0.2.1

* **Fix:** Remove extension activation log (issue [#4](https://github.com/alefragnani/vscode-copy-word/issues/4))

## Version 0.2.0

* License updated

## Version 0.0.3

* Marketplace updates

## Version 0.0.1

* Initial release

# License

[MIT](LICENSE.md) &copy; Alessandro Fragnani

---

[![Paypal Donations](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=EP57F3B6FXKTU&lc=US&item_name=Alessandro%20Fragnani&item_number=vscode%20extensions&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted) a :coffee: if you enjoy using this extension :thumbsup: