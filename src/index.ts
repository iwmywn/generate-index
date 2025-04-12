#!/usr/bin/env node
import fs from "fs";
import path from "path";
import readline from "readline";

const folders = process.argv.slice(2);

function getAllCodeFiles(dir: string, relativeTo: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(relativeTo, fullPath);

    if (entry.isDirectory()) {
      files.push(...getAllCodeFiles(fullPath, relativeTo));
    } else if (
      !entry.name.startsWith("index.") &&
      [".ts", ".tsx", ".js", ".jsx"].some((ext) => entry.name.endsWith(ext))
    ) {
      files.push(relativePath);
    }
  }

  return files;
}

function askQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
}

(async () => {
  for (const folder of folders) {
    const folderPath = path.resolve(process.cwd(), folder);
    const files = getAllCodeFiles(folderPath, folderPath);

    const importLines: string[] = [];
    const importTypeLines: string[] = [];
    const exportNames: string[] = [];
    const exportTypeNames: string[] = [];

    for (const relativeFile of files) {
      const filePath = path.join(folderPath, relativeFile);
      const content = fs.readFileSync(filePath, "utf-8");
      const importPath =
        "./" + relativeFile.replace(/\.[jt]sx?$/, "").replace(/\\/g, "/");
      const name = path.basename(relativeFile).replace(/\.[jt]sx?$/, "");

      const hasDefault = /export\s+default/.test(content);
      const matches = [
        ...content.matchAll(
          /export\s+(const|function|type|interface|class)\s+(\w+)/g
        ),
      ];

      const normalExports: string[] = [];
      const typeExports: string[] = [];

      for (const [, kind, identifier] of matches) {
        if (kind === "type" || kind === "interface") {
          typeExports.push(identifier);
        } else {
          normalExports.push(identifier);
        }
      }

      if (hasDefault) {
        importLines.push(`import ${name} from "${importPath}";`);
        exportNames.push(name);
      }

      if (normalExports.length > 0) {
        importLines.push(
          `import { ${normalExports.join(", ")} } from "${importPath}";`
        );
        exportNames.push(...normalExports);
      }

      if (typeExports.length > 0) {
        importTypeLines.push(
          `import type { ${typeExports.join(", ")} } from "${importPath}";`
        );
        exportTypeNames.push(...typeExports);
      }
    }

    const hasIndexJS = fs.existsSync(path.join(folderPath, "index.js"));
    const hasIndexTS = fs.existsSync(path.join(folderPath, "index.ts"));
    let indexFile = "";

    if (hasIndexJS) {
      indexFile = "index.js";
    } else if (hasIndexTS) {
      indexFile = "index.ts";
    } else {
      const answer = await askQuestion(
        `📦 No index file found in ${folder}. Create index.ts or index.js? (ts/js): `
      );
      indexFile =
        answer.trim().toLowerCase() === "js" ? "index.js" : "index.ts";
    }

    const indexContent =
      `// ⚠️ This file is auto-generated. Do not edit manually.\n` +
      `// To regenerate, run one of the following:\n` +
      `//   • With installation: npm run generate:index\n` +
      `//   • Without installation: npx @iwmywn/generate-index <folder-path>\n` +
      `// For more info: https://github.com/iwmywn/iwmywn-generate-index#readme\n\n` +
      [...importLines, ...importTypeLines].join("\n") +
      "\n\n" +
      (exportNames.length > 0
        ? `export {\n  ${[...new Set(exportNames)].join(",\n  ")},\n};\n\n`
        : "") +
      (exportTypeNames.length > 0
        ? `export type {\n  ${[...new Set(exportTypeNames)].join(
            ",\n  "
          )},\n};\n`
        : "");

    fs.writeFileSync(path.join(folderPath, indexFile), indexContent);
    console.log(`✅ ${indexFile} generated in ${folderPath}`);
  }
})();
