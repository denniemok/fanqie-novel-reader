import { useState, useEffect } from 'react';
import { useConvertedText } from '../../hooks/useConvertedText';
import { normalizeDiscoverBookInfo, resolveBookDisplay } from '../../utils/book/bookInfo';
import { useBookDisplayVariant } from '../../contexts/BookDisplayVariantContext';
import { getCoverMetaEntries } from '../../utils/coverMetaLines';
import { cardKeyDownHandler } from '../../utils/cardInteraction';
import {
  Author,
  DiscoverGridCard,
  CoverImg,
  CoverMetaLine,
  CoverMetaOverlayBottom,
  CoverPlaceholder,
  CoverWrapper,
  Info,
  Title,
} from './styles';

function DiscoverBookGridCard({ book, conversionMode, onClick, sortBy = 'default' }) {
  const info = normalizeDiscoverBookInfo(book);
  const { variant } = useBookDisplayVariant();
  const { book_name, thumb_url } = resolveBookDisplay(info, variant, book?.book_id);
  const convertedName = useConvertedText(book_name, conversionMode);
  const convertedAuthor = useConvertedText(info.author, conversionMode);
  const convertedCategory = useConvertedText(info.category, conversionMode);
  const convertedWordCount = useConvertedText(info.word_number, conversionMode);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [thumb_url, variant]);

  const coverMetaLines = getCoverMetaEntries(sortBy, {
    score: info.score,
    lastPublishTime: info.last_publish_time,
    wordCount: info.word_number,
    category: info.category,
    convertedWordCount,
    convertedCategory,
  });

  return (
    <DiscoverGridCard
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={cardKeyDownHandler(onClick)}
    >
      <CoverWrapper>
        {thumb_url && !imgError ? (
          <CoverImg src={thumb_url} alt="" loading="lazy" onError={() => setImgError(true)} />
        ) : (
          <CoverPlaceholder>無封面</CoverPlaceholder>
        )}
        {coverMetaLines.length > 0 && (
          <CoverMetaOverlayBottom>
            {coverMetaLines.map(({ key, text }) => (
              <CoverMetaLine key={key}>{text}</CoverMetaLine>
            ))}
          </CoverMetaOverlayBottom>
        )}
      </CoverWrapper>
      <Info>
        <Title>{convertedName || book.book_id}</Title>
        <Author>{convertedAuthor || '\u00A0'}</Author>
      </Info>
    </DiscoverGridCard>
  );
}

export default DiscoverBookGridCard;
