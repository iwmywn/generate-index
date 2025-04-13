# @iwmywn/generate-index

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

This CLI tool auto-generates index.ts or index.js files to import and export modules in a folder structure. It's helpful for simplifying the process of managing imports and exports in larger projects.

## Features

- Recursively scans the specified directories for `.ts`, `.tsx`, `.js`, `.jsx` files.
- Generates an `index.ts` or `index.js` file that imports and exports all modules.
- Supports default and named exports.
- Prompts for the type of index file to create if none exists.

## Without installation

```bash
npx @iwmywn/generate-index <folder-path-1> <folder-path-2> ...
```

Example:

```bash
npx @iwmywn/generate-index src/components src/pages
```

## With installation

```bash
npm i -D @iwmywn/generate-index
```

In your package.json, add a script like this:

```json
"scripts": {
  "generate:index": "iwmywn-generate-index <folder-path-1> <folder-path-2> ..."
}
```

Example:

```json
"scripts": {
  "generate:index": "iwmywn-generate-index src/components src/pages"
}
```

Then run:

```bash
npm run generate:index
```

## Example of Generated index.ts

```ts
// ⚠️ This file is auto-generated. Do not edit manually.
// For more info: https://github.com/iwmywn/iwmywn-generate-index#readme

import { SomeComponent } from "./SomeComponent";
import { AnotherComponent } from "./AnotherComponent";
import type { SomeType } from "./SomeType";

export { SomeComponent, AnotherComponent };

export type { SomeType };
```

## License

[MIT](./LICENSE) License © 2025-Present [Hoang Anh Tuan](https://github.com/iwmywn)

[npm-version-src]: https://img.shields.io/npm/v/%40iwmywn%2Fgenerate-index?style=flat&colorA=5d5d5d&colorB=1082c3
[npm-version-href]: https://www.npmjs.com/package/%40iwmywn%2Fgenerate-index
[npm-downloads-src]: https://img.shields.io/npm/dm/%40iwmywn%2Fgenerate-index?style=flat&colorA=5d5d5d&colorB=1082c3
[npm-downloads-href]: https://npmjs.com/package/%40iwmywn%2Fgenerate-index
[bundle-src]: https://img.shields.io/bundlephobia/minzip/%40iwmywn%2Fgenerate-index?style=flat&colorA=5d5d5d&colorB=1082c3&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=%40iwmywn%2Fgenerate-index
[license-src]: https://img.shields.io/github/license/iwmywn/iwmywn-generate-index.svg?style=flat&colorA=5d5d5d&colorB=1082c3
[license-href]: https://github.com/iwmywn/iwmywn-generate-index/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=5d5d5d&colorB=1082c3
[jsdocs-href]: https://www.jsdocs.io/package/%40iwmywn%2Fgenerate-index
