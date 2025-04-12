# generate-index

This CLI tool auto-generates index.ts or index.js files to import and export modules in a folder structure. It's helpful for simplifying the process of managing imports and exports in larger projects.

## Features

- Recursively scans the specified directories for `.ts`, `.tsx`, `.js`, `.jsx` files.
- Generates an `index.ts` or `index.js` file that imports and exports all modules.
- Supports default and named exports.
- Prompts for the type of index file to create if none exists.

## Installation

```bash
npm i @iwmywn/generate-index tsx
```

## Usage

In your package.json, add a script like this:

```json
"scripts": {
  "generate:index": "tsx scripts/generateIndex.ts <folder-path-1> <folder-path-2> ..."
}
```

Example:

```json
"scripts": {
  "generate:index": "tsx scripts/generateIndex.ts src/components src/pages"
}
```

Then run:

```bash
npm run generate:index
```

## Example of Generated index.ts

```ts
// ⚠️ This file is auto-generated. Do not edit manually.
// To regenerate, run: `npm run generate:index`

import { SomeComponent } from "./SomeComponent";
import { AnotherComponent } from "./AnotherComponent";
import type { SomeType } from "./SomeType";

export { SomeComponent, AnotherComponent };

export type { SomeType };
```

## License

[MIT](./LICENSE) License © 2025-Present [Hoang Anh Tuan](https://github.com/iwmywn)
