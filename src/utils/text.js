import { MAX_ABSTRACT_LENGTH, MOBILE_ABSTRACT_LENGTH } from './constants';

export { MAX_ABSTRACT_LENGTH, MOBILE_ABSTRACT_LENGTH };

/** Strip HTML, normalize newlines; map “ ” (U+201C/U+201D) to 「 」(corner quotes). */
export function cleanText(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  let filteredText = (doc.body.textContent || '')
    .replace(/\n+/g, '\n')
    .replace(/\n\s*\n/g, '\n');
  if (filteredText.startsWith('\n')) filteredText = filteredText.substring(1);
  if (!filteredText.endsWith('\n')) filteredText += '\n';
  return filteredText.replace(/\u201c/g, '\u300c').replace(/\u201d/g, '\u300d');
}

export function cleanAbstract(text) {
  if (!text) return '';
  return cleanText(text).replace(/\n[\u3000]+/g, '\n').trim();
}

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
