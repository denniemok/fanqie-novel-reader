import JSZip from 'jszip';
import { triggerFileDownload } from './downloadFile';
import {
  collectCachedChaptersForExport,
  fetchExportCoverImage,
  getExportLanguageCode,
  resolveExportBookMetadata,
  sanitizeExportFileName,
} from './exportBookCommon';

export { EXPORT_NO_CACHED_CHAPTERS_MSG } from './exportBookCommon';

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function textToXhtmlParagraphs(text) {
  const paragraphs = String(text ?? '')
    .split(/\n\n+/)
    .map((block) => block.replace(/\n/g, '').trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return '<p></p>';
  return paragraphs.map((paragraph) => `<p>${escapeXml(paragraph)}</p>`).join('\n    ');
}

function buildChapterXhtml(title, content) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="zh" lang="zh">
  <head>
    <title>${escapeXml(title)}</title>
    <meta charset="UTF-8"/>
    <style>
      body { font-family: serif; line-height: 1.8; margin: 1.2em; }
      h1 { font-size: 1.2em; margin-bottom: 1em; }
      p { margin: 0 0 0.8em; text-indent: 2em; }
    </style>
  </head>
  <body>
    <h1>${escapeXml(title)}</h1>
    ${textToXhtmlParagraphs(content)}
  </body>
</html>`;
}

function buildCoverXhtml(coverFileName, bookName) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="zh" lang="zh">
  <head>
    <title>${escapeXml(bookName)}</title>
    <meta charset="UTF-8"/>
    <style>
      body { margin: 0; padding: 0; text-align: center; }
      img { max-width: 100%; max-height: 100vh; object-fit: contain; }
    </style>
  </head>
  <body epub:type="cover">
    <img src="${escapeXml(coverFileName)}" alt="${escapeXml(bookName)}"/>
  </body>
</html>`;
}

function buildTitleXhtml(bookName, author, abstract) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="zh" lang="zh">
  <head>
    <title>${escapeXml(bookName)}</title>
    <meta charset="UTF-8"/>
    <style>
      body { font-family: serif; line-height: 1.7; margin: 1.2em; }
      h1 { font-size: 1.5em; margin-bottom: 0.4em; }
      .author { color: #555; margin-bottom: 1.2em; }
      p { margin: 0 0 0.8em; }
    </style>
  </head>
  <body>
    <h1>${escapeXml(bookName)}</h1>
    <p class="author">${escapeXml(author)}</p>
    <p>${escapeXml(abstract || '（無簡介）')}</p>
  </body>
</html>`;
}

function buildNavXhtml(bookName, chapterLinks) {
  const items = chapterLinks
    .map(({ href, title }) => `      <li><a href="${href}">${escapeXml(title)}</a></li>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="zh" lang="zh">
  <head>
    <title>目錄</title>
    <meta charset="UTF-8"/>
  </head>
  <body>
    <nav epub:type="toc" id="toc">
      <h1>${escapeXml(bookName)}</h1>
      <ol>
${items}
      </ol>
    </nav>
  </body>
</html>`;
}

function buildContentOpf({
  bookUuid,
  bookName,
  author,
  language,
  modified,
  manifestItems,
  spineItems,
  coverMeta = '',
}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="BookId">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="BookId">urn:uuid:${bookUuid}</dc:identifier>
    <dc:title>${escapeXml(bookName)}</dc:title>
    <dc:creator>${escapeXml(author)}</dc:creator>
    <dc:language>${escapeXml(language)}</dc:language>
    <meta property="dcterms:modified">${modified}</meta>
${coverMeta}
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
${manifestItems}
  </manifest>
  <spine>
${spineItems}
  </spine>
</package>`;
}

/**
 * Builds and downloads a book .epub file with cached chapter content.
 *
 * @param {Object} params
 * @param {string} params.bookId
 * @param {Object} params.bookInfo
 * @param {Array<{item_id: string, title: string}>} params.itemDataList
 * @param {'ascending'|'descending'} [params.sortOrder]
 * @param {string} [params.conversionMode]
 * @param {'new'|'old'} [params.displayVariant]
 * @returns {Promise<{ exportedCount: number }>}
 */
export async function exportBookToEpub({
  bookId,
  bookInfo,
  itemDataList,
  sortOrder = 'ascending',
  conversionMode = 'tw',
  displayVariant = 'new',
}) {
  if (!bookId || !bookInfo || !itemDataList?.length) return { exportedCount: 0 };

  const { bookName, author, abstract, thumbUrl } = resolveExportBookMetadata({
    bookId,
    bookInfo,
    conversionMode,
    displayVariant,
  });

  const chapters = await collectCachedChaptersForExport({
    itemDataList,
    sortOrder,
    conversionMode,
  });

  if (chapters.length === 0) return { exportedCount: 0 };

  const coverImage = await fetchExportCoverImage(thumbUrl);

  const zip = new JSZip();
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });
  zip.folder('META-INF')?.file(
    'container.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`,
  );

  const oebps = zip.folder('OEBPS');
  const manifestItems = [];
  const spineItems = [];
  let coverMeta = '';

  if (coverImage) {
    const coverFileName = `cover.${coverImage.extension}`;
    oebps?.file(coverFileName, coverImage.data);
    oebps?.file('cover.xhtml', buildCoverXhtml(coverFileName, bookName));
    manifestItems.push(
      `    <item id="cover-image" href="${coverFileName}" media-type="${coverImage.mediaType}" properties="cover-image"/>`,
      '    <item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>',
    );
    spineItems.push('    <itemref idref="cover"/>');
    coverMeta = '    <meta name="cover" content="cover-image"/>';
  }

  oebps?.file('title.xhtml', buildTitleXhtml(bookName, author, abstract));
  manifestItems.push('    <item id="title" href="title.xhtml" media-type="application/xhtml+xml"/>');
  spineItems.push('    <itemref idref="title"/>');
  const navLinks = [];

  chapters.forEach((chapter, index) => {
    const fileName = `chapter-${index + 1}.xhtml`;
    const itemId = `chapter-${index + 1}`;
    oebps?.file(fileName, buildChapterXhtml(chapter.title, chapter.content));
    manifestItems.push(
      `    <item id="${itemId}" href="${fileName}" media-type="application/xhtml+xml"/>`,
    );
    spineItems.push(`    <itemref idref="${itemId}"/>`);
    navLinks.push({ href: fileName, title: chapter.title });
  });

  oebps?.file('nav.xhtml', buildNavXhtml(bookName, navLinks));

  const bookUuid = crypto.randomUUID();
  const modified = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  const language = getExportLanguageCode(conversionMode);

  oebps?.file(
    'content.opf',
    buildContentOpf({
      bookUuid,
      bookName,
      author,
      language,
      modified,
      manifestItems: manifestItems.join('\n'),
      spineItems: spineItems.join('\n'),
      coverMeta,
    }),
  );

  const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' });
  const safeName = sanitizeExportFileName(bookName, bookId);
  triggerFileDownload(blob, `${safeName}.epub`, 'application/epub+zip');
  return { exportedCount: chapters.length };
}
