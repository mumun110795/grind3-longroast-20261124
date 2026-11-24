import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The whole entry: one sentence, one arc. The subcommittee's authority is
// built up clause by clause, then collapses at the dais when the final
// bill has to become a PDF and the only plan is print, crooked scan, and
// a hopeful question to a staffer about a photograph.
const ENTRY =
  "The subcommittee spent six solemn hearings drafting strict rules for artificial intelligence, blockchain, and the entire internet, then adjourned in defeat when nobody at the dais could convert the final bill into a PDF without printing it, scanning it crooked, and asking a staffer if a photograph counted.";

const MIN_CHARS = 1;
const MAX_CHARS = 320;

function checkGate(text: string): void {
  const length = [...text].length;
  if (length < MIN_CHARS || length > MAX_CHARS) {
    throw new Error(
      `entry is ${length} characters, outside the ${MIN_CHARS}-${MAX_CHARS} gate`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  // The brief demands exactly one sentence: a single sentence-ending
  // full stop, at the very end, and no other terminal punctuation.
  const stops = [...text].filter((ch) => ch === "." || ch === "!" || ch === "?");
  if (stops.length !== 1 || !text.endsWith(".")) {
    throw new Error("entry must be exactly one sentence ending in a full stop");
  }
}

function main(): void {
  checkGate(ENTRY);

  const outDir = process.env.OUTPUT_DIR ?? "/output";
  // The output dir may be a mounted volume, so create it if needed and
  // write into it — never remove the directory itself.
  mkdirSync(outDir, { recursive: true });

  const target = join(outDir, "entry.txt");
  writeFileSync(target, ENTRY, { encoding: "utf8" });
  console.log(`wrote ${target} (${[...ENTRY].length} characters)`);
}

main();
