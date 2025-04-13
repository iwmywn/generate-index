import fs from "fs";
import path from "path";

const supportedExtensions = [".ts", ".tsx", ".js", ".jsx"];

export function getAllCodeFiles(dir: string, relativeTo: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(relativeTo, fullPath);

    if (entry.isDirectory()) {
      files.push(...getAllCodeFiles(fullPath, relativeTo));
    } else if (
      !entry.name.startsWith("index.") &&
      supportedExtensions.some((ext) => entry.name.endsWith(ext))
    ) {
      files.push(relativePath);
    }
  }

  return files;
}
