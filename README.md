# Copy Word in Cursor

**Copy Word in Cursor** is an open source extension created for **Visual Studio Code**. While being free and open source, if you find it useful, please consider [supporting it](#support)

It can replace the default Copy/Cut commands, using the current word when no text is selected.

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

## Support

While **Copy Word in Cursor** is free and open source, if you find it useful, please consider supporting it.

I've been working on this on my spare time, and while I enjoy developing it, I would like to be able to give more attention to its growth.


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

---

# License

[MIT](LICENSE.md) &copy; Alessandro Fragnani