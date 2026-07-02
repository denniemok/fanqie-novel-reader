import { chapterCache } from '../cache';
import { maybeConvert } from '../text/zh-convert';
import { getChapterTitle } from '../chapter-helpers';
import { addBlankLine } from '../text/text';
import { sortChaptersByNumber } from '../sorting';
import { resolveBookDisplay } from '../book/bookInfo';

/** Shown when export runs but no chapters are cached locally. */
export const EXPORT_NO_CACHED_CHAPTERS_MSG = '沒有已下載的章節，請先下載後再匯出。';

export function sanitizeExportFileName(name, fallback) {
  return (name || '').replace(/[<>:"/\\|?*]/g, '_').trim().slice(0, 200) || fallback;
}

export function resolveExportBookMetadata({
  bookId,
  bookInfo,
  conversionMode = 'tw',
  displayVariant = 'new',
}) {
  const bookInfoData = bookInfo?.book_info || bookInfo;
  const { book_name: bookNameRaw, thumb_url: thumbUrl } = resolveBookDisplay(
    bookInfoData,
    displayVariant,
    bookId,
  );
  const bookName = maybeConvert(bookNameRaw, conversionMode);
  const author = maybeConvert(bookInfoData?.author, conversionMode);
  const abstract = maybeConvert(bookInfoData?.abstract, conversionMode);
  return { bookName, author, abstract, thumbUrl };
}

export function getExportLanguageCode(conversionMode) {
  if (conversionMode === 'hk') return 'zh-HK';
  if (conversionMode === 'tw') return 'zh-TW';
  return 'zh-CN';
}

/**
 * @param {Object} params
 * @param {Array<{item_id: string, title: string}>} params.itemDataList
 * @param {'ascending'|'descending'} [params.sortOrder]
 * @param {string} [params.conversionMode]
 * @returns {Promise<Array<{ itemId: string, title: string, content: string }>>}
 */
export async function collectCachedChaptersForExport({
  itemDataList,
  sortOrder = 'ascending',
  conversionMode = 'tw',
}) {
  const sortedList = sortChaptersByNumber(itemDataList, sortOrder);
  const chapters = [];

  for (const item of sortedList) {
    const content = await chapterCache.get(item.item_id);
    if (content == null || typeof content !== 'string') continue;

    const plain = addBlankLine(content);
    chapters.push({
      itemId: item.item_id,
      title: maybeConvert(getChapterTitle(item), conversionMode),
      content: maybeConvert(plain, conversionMode).trim(),
    });
  }

  return chapters;
}

function inferImageExtension(mediaType, url) {
  if (mediaType === 'image/png') return 'png';
  if (mediaType === 'image/gif') return 'gif';
  if (mediaType === 'image/webp') return 'webp';
  const match = String(url || '').match(/\.(jpe?g|png|webp|gif)(?:\?|$)/i);
  if (match) return match[1].toLowerCase().replace('jpeg', 'jpg');
  return 'jpg';
}

function inferImageMediaType(extension) {
  if (extension === 'png') return 'image/png';
  if (extension === 'gif') return 'image/gif';
  if (extension === 'webp') return 'image/webp';
  return 'image/jpeg';
}

function isImageMediaType(mediaType) {
  return Boolean(mediaType?.startsWith('image/'));
}

/**
 * Loads an image URL and verifies it decoded with real dimensions.
 * Mirrors UI cover behavior: onError or empty image => unusable cover.
 * @param {string} url
 * @returns {Promise<HTMLImageElement | null>}
 */
function decodeAndValidateImageUrl(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (!img.naturalWidth || !img.naturalHeight) {
        resolve(null);
        return;
      }
      resolve(img);
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

async function imageElementToExportData(img) {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(img, 0, 0);
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.92);
    });
    if (!blob) return null;

    const data = await blob.arrayBuffer();
    if (!data.byteLength) return null;

    return { data, mediaType: 'image/jpeg', extension: 'jpg' };
  } catch {
    return null;
  }
}

async function loadCoverFromUrl(url) {
  const img = await decodeAndValidateImageUrl(url);
  if (!img) return null;
  return imageElementToExportData(img);
}

/**
 * Fetches a book cover for export. Returns null when the image is missing,
 * fails to load, or decodes to an empty/broken image — same idea as UI onError.
 * @param {string | null | undefined} url
 * @returns {Promise<{ data: ArrayBuffer, mediaType: string, extension: string } | null>}
 */
export async function fetchExportCoverImage(url) {
  if (!url) return null;

  try {
    const response = await fetch(url);
    if (!response.ok) return loadCoverFromUrl(url);

    const mediaType = response.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() || '';
    if (mediaType && !isImageMediaType(mediaType)) return null;

    const data = await response.arrayBuffer();
    if (!data.byteLength) return null;

    const extension = inferImageExtension(mediaType, url);
    const resolvedMediaType = mediaType || inferImageMediaType(extension);
    const objectUrl = URL.createObjectURL(new Blob([data], { type: resolvedMediaType }));

    try {
      const img = await decodeAndValidateImageUrl(objectUrl);
      if (!img) return null;

      if (resolvedMediaType === 'image/webp' || resolvedMediaType === 'image/gif') {
        return imageElementToExportData(img);
      }

      return { data, mediaType: resolvedMediaType, extension };
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  } catch {
    return loadCoverFromUrl(url);
  }
}
