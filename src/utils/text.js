export const MAX_ABSTRACT_LENGTH = 80;
export const MOBILE_ABSTRACT_LENGTH = 45;

export function cleanAbstract(text) {
  if (!text) return '';
  return text.replace(/\n　　/g, '\n').trim();
}

export function truncateText(text, maxLength = MAX_ABSTRACT_LENGTH) {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
}
