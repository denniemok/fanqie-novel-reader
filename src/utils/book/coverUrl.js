const HEIC_URL_RE = /\.heic(?:\?|#|$)|\.heif(?:\?|#|$)/i;

/**
 * Signed fqnovelpic URLs (`~tplv-….heic`) 403 if the extension is rewritten,
 * and the HEIC file stays blank on many phones. The same object is also
 * published as an unsigned JPEG at `p3-novel.byteimg.com/{bucket}/{id}~noop.jpeg`.
 * novel-pic-r and novel-static are not available there, so those stay on the signed URL.
 */
const BROWSER_COVER_BUCKET_RE = /^\/(novel-pic|novel-images)\/([^/~]+)~/;
const BROWSER_COVER_HOST = 'https://p3-novel.byteimg.com';

/** @type {Map<string, string>} */
const displayUrlCache = new Map();

/** @type {Map<string, Promise<string | null>>} */
const inflightConversions = new Map();

/** @type {Promise<typeof import('heic2any').default> | null} */
let heic2anyPromise = null;

/** True when the cover URL path ends in .heic or .heif (before query string). */
export function isHeicCoverUrl(url) {
  return Boolean(url && HEIC_URL_RE.test(url));
}

/**
 * Browser-displayable URL for a Fanqie cover, when the CDN hosts one.
 * Returns null when the URL should be used as-is (or converted from HEIC).
 * @param {string | null | undefined} url
 * @returns {string | null}
 */
export function browserCoverUrl(url) {
  if (!url) return null;
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const match = parsed.pathname.match(BROWSER_COVER_BUCKET_RE);
  if (!match) return null;
  return `${BROWSER_COVER_HOST}/${match[1]}/${match[2]}~noop.jpeg`;
}

/**
 * Ordered ways to show one cover URL. The unsigned JPEG comes first.
 * HEIC is converted later and is never used as an <img> src.
 * @param {string | null | undefined} url
 * @returns {Array<{ type: 'url' | 'heic', src: string }>}
 */
export function coverDisplayAttempts(url) {
  if (!url) return [];
  const origin = browserCoverUrl(url);
  /** @type {Array<{ type: 'url' | 'heic', src: string }>} */
  const attempts = [];
  if (origin) attempts.push({ type: 'url', src: origin });
  if (isHeicCoverUrl(url)) {
    attempts.push({ type: 'heic', src: url });
  } else if (!origin || origin !== url) {
    attempts.push({ type: 'url', src: url });
  }
  return attempts;
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

  const pending = inflightConversions.get(url);
  if (pending) return pending;

  const task = fetchAndConvertHeicToJpeg(url)
    .then((jpegBlob) => {
      const objectUrl = URL.createObjectURL(jpegBlob);
      displayUrlCache.set(url, objectUrl);
      return objectUrl;
    })
    .catch(() => null)
    .finally(() => {
      inflightConversions.delete(url);
    });

  inflightConversions.set(url, task);
  return task;
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
