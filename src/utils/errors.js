import { AUTO_BAN_DURATION_MINUTES } from './constants';

export class HttpError extends Error {
  constructor(message, { status } = {}) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

/** Builds an HttpError from a non-OK fetch Response (body is consumed). */
export async function httpErrorFromResponse(res) {
  let detail = null;
  try {
    const json = await res.json();
    detail = json?.error ?? json?.detail ?? json?.message;
  } catch {
    // ignore non-JSON bodies
  }
  return new HttpError(detail || `HTTP ${res.status}`, { status: res.status });
}

/**
 * Formats an error for user display. Handles known API/network error types
 * and falls back to the provided default message.
 */
export function formatErrorMessage(error, defaultMessage) {
  if (!error) return defaultMessage;
  const msg = error.message ?? '';
  const name = error.name ?? '';

  if (error.status === 429) {
    return '請求過於頻繁，請稍後再試。';
  }

  if (error.status === 403) {
    return `請求過於頻繁，您已被暫時封禁 ${AUTO_BAN_DURATION_MINUTES} 分鐘，請稍後再試。`;
  }

  if (msg.includes('timed out')) {
    return `請求超時，請稍後再試。`;
  }
  if (msg.includes('Invalid book ID') || msg.includes('book not found')) {
    return '書籍 ID 無效或找不到該書籍，請檢查後重試。';
  }
  if (msg.includes('Failed to decode')) {
    return '回傳資料無效，請稍後再試。';
  }
  if (
    msg.includes('Failed to fetch') ||
    msg.includes('Invalid response from server') ||
    msg.includes('Load failed') ||
    msg.includes('network') ||
    name === 'NetworkError'
  ) {
    return '請求失敗，請稍後再試。';
  }
  if (name === 'SyntaxError' || msg.includes('Unexpected token')) {
    return '回傳格式錯誤，請稍後再試。';
  }
  return defaultMessage;
}
