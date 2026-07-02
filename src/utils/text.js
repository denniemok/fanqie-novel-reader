/** Blank line between paragraph blocks for .txt export (cached chapters use one newline per paragraph, like the Reader). */
export function addBlankLine(text) {
  if (!text) return '';
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n\n');
}

/** Expanded abstract: each source line break becomes a visible paragraph gap. */
export function formatExpandedAbstract(text) {
  if (!text) return '';
  return text.replace(/\r?\n/g, '\n\n');
}
