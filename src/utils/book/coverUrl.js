const HEIC_URL_RE = /\.heic(?:\?|$)|\.heif(?:\?|$)/i;

/** @type {Map<string, string>} */
const displayUrlCache = new Map();

/** @type {Promise<typeof import('heic2any').default> | null} */
let heic2anyPromise = null;

/** True when the cover URL path ends in .heic or .heif (before query string). */
export function isHeicCoverUrl(url) {
  return Boolean(url && HEIC_URL_RE.test(url));
}

function loadHeic2Any() {
  if (!heic2anyPromise) {
    heic2anyPromise = import('heic2any').then((mod) => mod.default);
  }
  return heic2anyPromise;
}

async function fetchCoverBlob(url) {
  const response = await fetch(url, { referrerPolicy: 'no-referrer' });
  if (!response.ok) {
    throw new Error(`Cover fetch failed: ${response.status}`);
  }
  const blob = await response.blob();
  if (!blob.size) {
    throw new Error('Cover fetch returned empty body');
  }
  return blob;
}

async function convertHeicBlobToJpeg(blob) {
  const heic2any = await loadHeic2Any();
  const result = await heic2any({ blob, toType: 'image/jpeg', quality: 0.85 });
  return Array.isArray(result) ? result[0] : result;
}

async function fetchAndConvertHeicToJpeg(url) {
  const blob = await fetchCoverBlob(url);
  return convertHeicBlobToJpeg(blob);
}

/**
 * Fetch a .heic/.heif cover and return a JPEG blob URL for display.
 * @param {string} url
 * @returns {Promise<string | null>}
 */
export async function convertHeicCoverUrl(url) {
  if (!url || !isHeicCoverUrl(url)) return null;

  const cached = displayUrlCache.get(url);
  if (cached) return cached;

  try {
    const jpegBlob = await fetchAndConvertHeicToJpeg(url);
    const objectUrl = URL.createObjectURL(jpegBlob);
    displayUrlCache.set(url, objectUrl);
    return objectUrl;
  } catch {
    return null;
  }
}

/**
 * Fetch a .heic/.heif cover and return JPEG bytes for export.
 * @param {string} url
 * @returns {Promise<Blob | null>}
 */
export async function fetchHeicCoverAsJpeg(url) {
  if (!url || !isHeicCoverUrl(url)) return null;

  try {
    return await fetchAndConvertHeicToJpeg(url);
  } catch {
    return null;
  }
}
