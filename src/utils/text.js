import { MAX_ABSTRACT_LENGTH, MOBILE_ABSTRACT_LENGTH } from './constants';

export { MAX_ABSTRACT_LENGTH, MOBILE_ABSTRACT_LENGTH };

/** Blank line between paragraph blocks for .txt export (cached chapters use one newline per paragraph, like the Reader). */
export function addBlankLine(text) {
  if (!text) return '';
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n\n');
}

export function truncateText(text, maxLength = MAX_ABSTRACT_LENGTH) {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
}
