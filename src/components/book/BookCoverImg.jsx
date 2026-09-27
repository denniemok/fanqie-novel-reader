import { useCoverImageSrc } from '../../hooks/book/useCoverImageSrc';

/**
 * Cover image with fallbacks and self-healing retries (see useCoverImageSrc).
 * Stays mounted after a failure so it can recover; renders Placeholder meanwhile.
 */
function BookCoverImg({
  url,
  fallbackUrl = null,
  alt = '',
  ImgComponent = 'img',
  Placeholder = null,
  ...props
}) {
  const { src, loading, failed, onError, attemptKey } = useCoverImageSrc(url, fallbackUrl);

  if (!url || failed) {
    return Placeholder ? <Placeholder>無封面</Placeholder> : null;
  }

  if (loading || !src) {
    return loading && Placeholder ? <Placeholder aria-busy="true">載入中</Placeholder> : null;
  }

  return (
    <ImgComponent
      key={attemptKey}
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={onError}
      {...props}
    />
  );
}

export default BookCoverImg;
