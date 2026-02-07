# Project Documentation

## Module: `argparse/lib/textwrap.js`

**Path**: `node_modules\eslint\node_modules\argparse\lib\textwrap.js`

### Overview

This module is a partial port of Python's `argparse` module (specifically version 3.9.0). It provides utilities for wrapping and filling text, similar to Python's `textwrap` library.

### Features & Line References

| Feature                   | Type     | Line(s) | Description                                                                   |
| :------------------------ | :------- | :------ | :---------------------------------------------------------------------------- |
| **Word Separation Regex** | Constant | 22      | Defines how words are split (US-ASCII whitespace).                            |
| **TextWrapper Class**     | Class    | 24      | Main class for wrapping/filling text.                                         |
| **Constructor**           | Method   | 65-80   | Initializes options like width, indentation, and whitespace handling.         |
| **\_munge_whitespace**    | Method   | 86-96   | Expands tabs and converts whitespace to spaces.                               |
| **\_split**               | Method   | 98-115  | Splits text into chunks based on `wordsep_simple_re`.                         |
| **\_handle_long_word**    | Method   | 117-145 | Handles words longer than the specified width.                                |
| **\_wrap_chunks**         | Method   | 147-234 | Core algorithm to wrap chunks into lines of `self.width`.                     |
| **\_split_chunks**        | Method   | 236-239 | Helper to munge whitespace and then split.                                    |
| **wrap (Method)**         | Method   | 243-256 | Public interface to wrap a single paragraph.                                  |
| **fill (Method)**         | Method   | 258-266 | Public interface to fill a single paragraph (returns string).                 |
| **wrap (Function)**       | Function | 271-283 | Convenience function to wrap text without creating a class instance manually. |
| **fill (Function)**       | Function | 285-297 | Convenience function to fill text without creating a class instance manually. |
| **dedent**                | Function | 304-343 | Removes common leading whitespace from multiline strings.                     |

### Variables

#### Global / Module Scope

| Variable Name            | Line | Value/Type | Description                                                                      |
| :----------------------- | :--- | :--------- | :------------------------------------------------------------------------------- |
| `wordsep_simple_re`      | 22   | `RegExp`   | Matches tabs, newlines, vertical tabs, form feeds, carriage returns, and spaces. |
| `_whitespace_only_re`    | 301  | `RegExp`   | Matches lines containing only whitespace.                                        |
| `_leading_whitespace_re` | 302  | `RegExp`   | Captures leading whitespace on lines.                                            |

#### Class Properties (`TextWrapper`)

Initialized in `constructor` (Lines 66-79):

- `width` (default: 70)
- `initial_indent` (default: '')
- `subsequent_indent` (default: '')
- `expand_tabs` (default: true)
- `replace_whitespace` (default: true)
- `fix_sentence_endings` (default: false)
- `break_long_words` (default: true)
- `drop_whitespace` (default: true)
- `break_on_hyphens` (default: true)
- `tabsize` (default: 8)
- `max_lines` (default: undefined)
- `placeholder` (default: ' [...]')

### Exports

The module exports the following functions via `module.exports` (Line 345):

1.  **`wrap`**: Function
2.  **`fill`**: Function
3.  **`dedent`**: Function

### Todos and Implementation Notes

The code contains specific comments indicating differences from the Python implementation or limitations in the JavaScript port.

| Type     | Line    | Content                         | Context                                                                                              |
| :------- | :------ | :------------------------------ | :--------------------------------------------------------------------------------------------------- |
| **Note** | 93      | `// not strictly correct in js` | Inside `_munge_whitespace`. Refers to `text.replace(/\t/g, ' '.repeat(this.tabsize))`.               |
| **Todo** | 253-255 | `// not implemented in js`      | Inside `wrap` method. The `fix_sentence_endings` feature is currently commented out/not implemented. |

---

## External Dependencies (Context)

The following libraries were present in the provided context but are external dependencies. Refer to their respective `README.md` files for full documentation.

### @testing-library/dom

- **Description**: Simple and complete DOM testing utilities.
- **Docs**: `node_modules\@testing-library\dom\README.md`

### espree

- **Description**: An Esprima-compatible JavaScript parser built on Acorn.
- **Docs**: `node_modules\espree\README.md`

### babel-plugin-macros

- **Description**: Allows you to build simple compile-time libraries.
- **Docs**: `node_modules\babel-plugin-macros\README.md`

### @testing-library/react

- **Description**: Simple and complete React DOM testing utilities.
- **Docs**: `node_modules\@testing-library\react\README.md`

### jest-diff

- **Description**: Display differences clearly so people can review changes confidently.
- **Docs**: `node_modules\jest-diff\README.md`

### baseline-browser-mapping

- **Description**: Maps browsers to Baseline features.
- **Docs**: `node_modules\baseline-browser-mapping\README.md`

### @babel/preset-modules

- **Description**: A Babel preset that enables modern browser features.
- **Docs**: `node_modules\@babel\preset-modules\README.md`

### common-tags

- **Description**: A set of well-tested, commonly used template literal tag functions.
- **Docs**: `node_modules\common-tags\readme.md`
