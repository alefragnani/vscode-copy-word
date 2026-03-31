# Copy Word in Cursor VS Code Extension

Always reference these instructions first and fall back to additional search or terminal commands only when project files do not provide enough context.

## Project Overview

Copy Word in Cursor is a TypeScript VS Code extension that enhances copy/cut/paste operations by automatically selecting the current word when no text is selected. The extension supports both desktop (Node.js) and web (browser) environments.

## Technology Stack

- Language: TypeScript
- Runtime: VS Code Extension API (Node + Web)
- Bundler: Webpack 5
- Linting: ESLint (`eslint-config-vscode-ext`)
- Testing: Mocha + `@vscode/test-electron`

## Working Effectively

Bootstrap and local setup:

```bash
npm install
```

Build and development quickstart:

```bash
npm run build
npm run lint
```

- Use `npm run watch` during active development.
- Use VS Code "Launch Extension" (F5) to validate behavior in Extension Development Host.
- Expected command timings are usually under 10 seconds.
- Never cancel `npm install`, `npm run watch`, or `npm test` once started.

## Build and Development Commands

- `npm run compile` - TypeScript compilation to `out/`
- `npm run build` - Webpack development build to `dist/`
- `npm run watch` - Continuous webpack build
- `npm run lint` - ESLint validation
- `npm run test` - Full test suite (network dependent)

## Testing and Validation

- Lint: `npm run lint` (about 1 second, current warnings are acceptable)
- Tests: `npm run test` may fail in restricted environments with `ENOTFOUND update.code.visualstudio.com`
- Manual validation:
  1. Run `npm run build`
  2. Launch Extension Host with F5
  3. Test copy/cut/paste with and without text selection
  4. Verify cursor behavior at word boundaries

## Project Structure and Key Files

```
src/
├── extension.ts          # Extension entry point
├── commands.ts           # Core copy/cut/paste implementations
├── constants.ts          # Operation and behavior enums
└── test/                 # Integration tests

dist/                     # Webpack bundles (extension-node.js, extension-web.js)
l10n/                     # Localization files
out/                      # TypeScript output for tests
```

## Coding Conventions and Patterns

### Indentation

- Use spaces, not tabs.
- Use 4 spaces for indentation.

### Naming Conventions

- Use PascalCase for `type` names
- Use PascalCase for `enum` values
- Use camelCase for `function` and `method` names
- Use camelCase for `property` names and `local variables`
- Use whole words in names when possible

### Types

- Do not export `types` or `functions` unless you need to share it across multiple components
- Do not introduce new `types` or `values` to the global namespace
- Prefer `const` over `let` when possible.

### Strings

- Prefer double quotes for new code; some existing files may still use single quotes.
- User-facing strings use two localization mechanisms:
  - **Manifest contributions** (commands, settings, walkthrough metadata): use `%key%` placeholders in `package.json`, with translations in `package.nls.json` and `package.nls.{LANGID}.json`. Do **not** use `l10n.t` for these.
  - **Runtime messages** (shown from extension code): use `l10n.t("message")`, with translations in `l10n/bundle.l10n.json` and `l10n/bundle.l10n.{LANGID}.json`.
- Externalized strings must not use string concatenation. Use placeholders instead (`{0}`).

### Code Quality

- All production source files under `src/` (excluding tests under `src/test`) must include the standard project copyright header
- Prefer `async` and `await` over `Promise` and `then` calls
- All user facing messages must be localized using the applicable localization framework (for example `l10n.t` method)
- Keep imports organized: VS Code first, then internal modules.
- Use semicolons at the end of statements.
- Keep changes minimal and aligned with existing style.

### Import Organization

- Import VS Code API first: `import * as vscode from "vscode"`
- Group related imports together
- Use named imports for specific VS Code types
- Import from local modules using relative paths

## Extension Features and Configuration

### Key Features
1. **Copy/Cut Behavior**: Automatically select the current word when no text is selected and copy/cut is invoked.
2. **Paste Behavior**: When pasting, if the clipboard content is a single word

### Important Settings
- `copyWord.useOriginalCopyBehavior`: Use original Cut/Copy behavior when no text is selected and no current word is defined

## Dependencies and External Tools

- No external runtime tools are required.
- Uses VS Code test-electron for integration tests.

## Troubleshooting and Known Limitations

- Network-restricted environments: `npm test` fails with VS Code download DNS errors.
- Watch mode issues: stop watch and run `npm run build` once.
- If command behavior diverges, validate both desktop and web launch configurations.

## CI and Pre-Commit Validation

- GitHub Actions runs on Windows, macOS, Linux.
- Before committing, run:
  1. `npm run lint`
  2. `npm run build`
  3. Manual extension-host verification

## Common Tasks

1. Add or update command behavior in `src/commands.ts` and keep tests in `src/test/suite/` aligned.
2. Update manifest contributions in `package.json` and localization keys in `package.nls*.json`.
3. Validate output bundles and expected command behavior for both node and web targets.




