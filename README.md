[![](https://vsmarketplacebadge.apphb.com/version-short/alefragnani.copy-word.svg)](https://marketplace.visualstudio.com/items?itemName=alefragnani.copy-word)
[![](https://vsmarketplacebadge.apphb.com/downloads-short/alefragnani.copy-word.svg)](https://marketplace.visualstudio.com/items?itemName=alefragnani.copy-word)
[![](https://vsmarketplacebadge.apphb.com/rating-short/alefragnani.copy-word.svg)](https://marketplace.visualstudio.com/items?itemName=alefragnani.copy-word)
[![](https://img.shields.io/github/workflow/status/alefragnani/vscode-copy-word/CI)](https://github.com/alefragnani/vscode-copy-word/actions?query=workflow%3ACI)

<p align="center">
  <br />
  <a title="Learn more about Copy Word in Cursor" href="http://github.com/alefragnani/vscode-copy-word"><img src="https://raw.githubusercontent.com/alefragnani/vscode-copy-word/master/images/vscode-copy-word-logo-readme.png" alt="Copy Word in Cursor Logo" width="70%" /></a>
</p>

# What's new in Copy Word in Cursor 3.4

* Support **Remote Development**
* Use new VS Code **Clipboard API**

# Support

**Copy Word in Cursor** is an open source extension created for **Visual Studio Code**. While being free and open source, if you find it useful, please consider supporting it.

<table align="center" width="60%" border="0">
  <tr>
    <td>
      <a title="Paypal" href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=EP57F3B6FXKTU&lc=US&item_name=Alessandro%20Fragnani&item_number=vscode%20extensions&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted"><img src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif"/></a>
    </td>
    <td>
      <a title="Paypal" href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=EP57F3B6FXKTU&lc=BR&item_name=Alessandro%20Fragnani&item_number=vscode%20extensions&currency_code=BRL&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted"><img src="https://www.paypalobjects.com/pt_BR/i/btn/btn_donate_SM.gif"/></a>
    </td>
    <td>
      <a title="Patreon" href="https://www.patreon.com/alefragnani"><img src="https://raw.githubusercontent.com/alefragnani/oss-resources/master/images/button-become-a-patron-rounded-small.png"/></a>
    </td>
  </tr>
</table>

# Copy Word in Cursor

It can replace the default `Copy` and `Cut` commands, using the _current word_ when no text is selected.

# Features

## Available commands

- `Copy Word: Copy` copy the current word
- `Copy Word: Cut` cut the current word

## Using as your default shortcuts

You only need to update your **Keyboard Shortcuts**. 

Go to `File / Preferences / Keyboard Shortcuts` and add two new entries:

### Windows/Linux
```json
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
```json
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

# License

[MIT](LICENSE.md) &copy; Alessandro Fragnani