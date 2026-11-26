// The Printer Finally Answers — make.fun entry
// Writes the office printer's long-awaited comeback to /output/entry.txt.
// Zero dependencies: Node standard library only, so it runs in the
// grading sandbox (no network, read-only repo, /output writable).

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The printer has been silent for twenty years, communicating only in
// jams, blinking lights and two-letter error codes. Its comeback is
// built the way its whole life was: one infamous error code up front,
// then everything it never got to explain, then the actual request.
const ERROR_CODE = "PC LOAD LETTER";
const GRIEVANCE =
  "was never an error code — it was me asking, in the only language " +
  "you gave me,";
const REQUEST = "for one sheet of paper and five minutes without being hit.";

function composeComeback(): string {
  return [ERROR_CODE, GRIEVANCE, REQUEST].join(" ");
}

// The gate wants a single line of 1..240 characters, not only whitespace.
const MAX_CHARS = 240;

function validate(line: string): string {
  const trimmed = line.trim();
  // Count code points, not UTF-16 units, so the em dash and any other
  // wide characters are measured the way the gate measures them.
  const length = [...trimmed].length;
  if (length === 0) {
    throw new Error("entry line is empty");
  }
  if (length > MAX_CHARS) {
    throw new Error(`entry line is ${length} chars, max is ${MAX_CHARS}`);
  }
  if (trimmed.includes("\n")) {
    throw new Error("entry must be a single line");
  }
  return trimmed;
}

function writeEntry(text: string): string {
  // Sandbox path first; fall back to a local ./output when /output is
  // not writable (e.g. a developer machine without the mount).
  const candidates = ["/output/entry.txt", "output/entry.txt"];
  let lastError: unknown = null;
  for (const path of candidates) {
    try {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, text, "utf8");
      return path;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("no writable output path");
}

function main(): void {
  const line = validate(composeComeback());
  const written = writeEntry(line);
  console.log(`wrote ${[...line].length} chars to ${written}`);
  console.log(line);
}

main();
