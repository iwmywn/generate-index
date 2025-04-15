import fs from "fs";
import path from "path";
import { askQuestion } from "./utils/askQuestion";
import { getAllCodeFiles } from "./utils/getAllCodeFiles";
import { printHelp, handleMissingArgs } from "./utils/help";

export async function main() {
  const folders = process.argv.slice(2);

  if (folders.includes("--help") || folders.includes("-h")) {
    printHelp();
    process.exit(0);
  }

  if (folders.length === 0) {
    await handleMissingArgs();
    process.exit(0);
  }

  for (const folder of folders) {
    const folderPath = path.resolve(process.cwd(), folder);

    if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
      console.error(`❌ Invalid path: "${folder}" is not a valid directory.`);
      continue;
    }

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
          /export\s+(const|let|var|function|type|interface|class|enum)\s+(\w+)/g
        ),
      ];
      const groupedExports = [...content.matchAll(/export\s*{\s*([^}]+)\s*}/g)];

      const normalExports: string[] = [];
      const typeExports: string[] = [];
      const identifiersFromGrouped: string[] = [];

      for (const [, kind, identifier] of matches) {
        if (kind === "type" || kind === "interface") {
          typeExports.push(identifier);
        } else {
          normalExports.push(identifier);
        }
      }

      for (const [, group] of groupedExports) {
        const identifiers = group.split(",").map((id) => id.trim());
        identifiersFromGrouped.push(...identifiers);
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

      if (identifiersFromGrouped.length > 0) {
        importLines.push(
          `import { ${identifiersFromGrouped.join(
            ", "
          )} } from "${importPath}";`
        );
        exportNames.push(...identifiersFromGrouped);
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
}
