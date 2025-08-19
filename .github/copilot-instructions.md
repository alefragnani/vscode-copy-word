# Copy Word in Cursor VS Code Extension

**ALWAYS follow these instructions exactly as written.** Only use additional search and context gathering if the information in these instructions is incomplete or found to be in error.

Copy Word in Cursor is a TypeScript VS Code extension that enhances copy/cut/paste operations by automatically selecting the current word when no text is selected. The extension supports both desktop (Node.js) and web (browser) environments.

## Working Effectively

- **Prerequisites**: Git >= 2.22.0, Node.js >= 14.17.27 (tested with Node.js 20.19.4, npm 10.8.2)
- **Bootstrap and build the repository**:
  - `npm install` -- takes 2-15 seconds. Downloads dependencies, may show deprecation warnings but succeeds.
  - `npm run compile` -- takes 2 seconds. TypeScript compilation to `out/` directory.
  - `npm run build` -- takes 3 seconds. Webpack development build to `dist/` directory.
  - `npm run vscode:prepublish` -- takes 3 seconds. Webpack production build (minified).
- **Development workflow**:
  - `npm run watch` -- continuous webpack build in development mode. NEVER CANCEL - runs until stopped.
  - Use VS Code Tasks: Press `Ctrl+Shift+B` (Windows/Linux) or `Cmd+Shift+B` (Mac) to start watch task.
  - For debugging: Open folder in VS Code, press `F5` to launch "Launch Extension" configuration.
  - After code changes: Use "Reload Window" in VS Code command palette (no restart needed).

## Testing and Validation

- **Linting**: `npm run lint` -- takes 1 second. Uses ESLint with vscode-ext config. Currently shows 5 warnings (non-null assertions and any types) but passes.
- **Testing**: `npm run test` -- **NETWORK DEPENDENT - NEVER CANCEL**: Requires internet to download VS Code via @vscode/test-electron. Set timeout to 60+ minutes. May take 30+ minutes on first run to download VS Code.
  - **IMPORTANT**: Tests fail in network-restricted environments with error "getaddrinfo ENOTFOUND update.code.visualstudio.com". This is expected behavior.
  - CI runs tests successfully on GitHub Actions with network access.
  - Test workspace located in `testworkspace/test.md`.
  - Uses integration tests that exercise actual VS Code extension functionality.
- **Manual validation**: After making changes, always test the extension by:
  1. Running `npm run build` 
  2. Press `F5` in VS Code to launch extension host
  3. Test copy/cut/paste functionality with and without text selection
  4. Verify word selection behavior at different cursor positions

## Build Outputs and Structure

- **Source code**: `src/` directory contains TypeScript files
  - `src/extension.ts` - Main extension entry point
  - `src/commands.ts` - Core copy/cut/paste command implementations  
  - `src/constants.ts` - Enums for operations and paste behaviors
  - `src/test/` - Integration test suite
- **Compiled outputs**:
  - `out/` - TypeScript compilation output (for testing)
  - `dist/` - Webpack bundles (for distribution)
    - `extension-node.js` - Desktop VS Code version
    - `extension-web.js` - Web/browser VS Code version
- **Key configuration files**:
  - `package.json` - Extension manifest, scripts, and dependencies
  - `webpack.config.js` - Dual build configuration (node + web)
  - `tsconfig.json` - TypeScript compiler settings
  - `.vscode/tasks.json` - VS Code build tasks
  - `.vscode/launch.json` - Debug configurations

## Extension Functionality

The extension provides three commands that work when no text is selected:
- `copy-word.copy` - Copy current word to clipboard
- `copy-word.cut` - Cut current word to clipboard  
- `copy-word.paste` - Paste over current word

**Settings**:
- `copyWord.useOriginalCopyBehavior` - Falls back to line copy/cut when no word found
- `copyWord.pasteWordBehavior` - Controls paste behavior: `original`, `replaceWordAtCursor`, or `replaceWordAtCursorWhenInTheMiddleOfTheWord`

## CI/CD and Quality

- **GitHub Actions**: `.github/workflows/main.yml` runs on push/PR to master
  - Tests on Windows, macOS, and Linux
  - Requires Node.js 16.x (configured in CI)
  - Uses `xvfb-run -a npm test` on Linux for headless testing
- **Before committing**: Always run `npm run lint` to check code style
- **Publishing**: Use `npm run vscode:prepublish` for production builds

## Common Tasks and Troubleshooting

- **Development debugging**: Use "Launch Extension" in VS Code Run and Debug panel (F5)
- **Web extension testing**: Use "Run Web Extension in VS Code" launch configuration
- **Watch mode issues**: If watch mode gets stuck, stop it and run `npm run build` manually
- **Test failures**: In network-restricted environments, tests fail due to VS Code download. This is expected.
- **Lint warnings**: Current codebase has 5 eslint warnings (non-null assertions and any types) - these are acceptable
- **Node.js compatibility**: Requires Node.js >= 14.17.27, tested successfully with 20.19.4

## Expected Command Outputs

- **Successful npm install**: Shows deprecation warnings but ends with "found 0 vulnerabilities"
- **Successful build**: Shows "webpack 5.94.0 compiled successfully" for both extension-node.js and extension-web.js  
- **Successful lint**: Shows 5 warnings (3 non-null assertions, 2 any types) but exits with code 0
- **Failed test (network restricted)**: Shows "Error: getaddrinfo ENOTFOUND update.code.visualstudio.com" - this is expected
- **Successful compile**: Produces files in `out/src/` directory without errors

## Key File Locations

- Main extension logic: `src/commands.ts` (registerCommands function)
- Extension entry point: `src/extension.ts` (activate function)  
- Test suite: `src/test/suite/commands.test.ts` and `src/test/suite/extension.test.ts`
- Build configuration: `webpack.config.js`
- VS Code extension manifest: `package.json` (contributes section)
- Localization: `l10n/` directory and `package.nls.*.json` files

## Timing Expectations 

- `npm install`: 2-15 seconds (network dependent, faster on subsequent runs)
- `npm run compile`: 2 seconds  
- `npm run build`: 3 seconds
- `npm run vscode:prepublish`: 3 seconds
- `npm run lint`: 1 second
- `npm run test`: **NEVER CANCEL** - 30+ minutes on first run (downloads VS Code), fails in network-restricted environments with DNS errors
- `npm run watch`: Continuous mode - **NEVER CANCEL** until explicitly stopped