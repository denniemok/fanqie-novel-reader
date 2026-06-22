/**
 * Extracts book ID from user input. Supports:
 * - Plain numeric ID: "123456789"
 * - Fanqie URL: "https://fanqienovel.com/page/123456789?query=xxx"
 * - Tomato MTL URL: "https://tomatomtl.com/book/123456789"
 *
 * @param {string} input - Raw input (bookId or URL)
 * @returns {string|null} Extracted book ID, or null if none found
 */
export function parseBookIdFromInput(input) {
  const trimmed = input?.trim();
  if (!trimmed) return null;

  // Match /page/{BOOKID} or /book/{BOOKID} - bookId is digits, may be followed by ?query
  const urlMatch = trimmed.match(/\/(?:page|book)\/(\d+)/);
  if (urlMatch) return urlMatch[1];

  // Plain numeric ID
  if (/^\d+$/.test(trimmed)) return trimmed;

  return null;
}
