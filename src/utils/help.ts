import { askQuestion } from "./askQuestion";

export function printHelp() {
  console.log(`
  📦 iwmywn-generate-index

  Usage:
    iwmywn-generate-index <folder-path-1> <folder-path-2> ...

  Examples:
    iwmywn-generate-index src/components
    iwmywn-generate-index ./utils ./hooks
  `);
}

export async function handleMissingArgs() {
  console.error("❌ Missing argument: Please provide at least one folder.");
  console.error("👉 You can type --help to see usage instructions.");

  const answer = await askQuestion("💡 Type --help or press Enter to exit: ");
  if (answer.trim() === "--help" || answer.trim() === "-h") {
    printHelp();
  } else {
    console.log("👋 Exiting...");
  }
}
