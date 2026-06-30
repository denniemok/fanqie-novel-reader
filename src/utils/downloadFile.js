/**
 * Triggers a browser file download.
 * Uses application/octet-stream by default so iOS Safari does not override
 * the filename extension (e.g. appending .json for application/json blobs).
 */
export function triggerFileDownload(content, filename, mimeType = 'application/octet-stream') {
  const blob =
    content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  return blob.size;
}
