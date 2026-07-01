import { useState } from 'react';
import { useConvertedText } from '../../hooks/useConvertedText';
import { normalizeDiscoverBookInfo } from '../../utils/bookInfo';
import { getCoverMetaEntries } from '../../utils/coverMetaLines';
import { cardKeyDownHandler } from '../../utils/cardInteraction';
import {
  Author,
  Card,
  CoverImg,
  CoverMetaLine,
  CoverMetaOverlayBottom,
  CoverPlaceholder,
  CoverWrapper,
  Info,
  Title,
} from './styles';

function DiscoverBookCard({ book, conversionMode, onClick, sortBy = 'default' }) {
  const info = normalizeDiscoverBookInfo(book);
  const convertedName = useConvertedText(info.book_name, conversionMode);
  const convertedAuthor = useConvertedText(info.author, conversionMode);
  const convertedCategory = useConvertedText(info.category, conversionMode);
  const convertedWordCount = useConvertedText(info.word_number, conversionMode);
  const [imgError, setImgError] = useState(false);

  const coverMetaLines = getCoverMetaEntries(sortBy, {
    score: info.score,
    lastPublishTime: info.last_publish_time,
    wordCount: info.word_number,
    category: info.category,
    convertedWordCount,
    convertedCategory,
  });

  return (
    <Card
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={cardKeyDownHandler(onClick)}
    >
      <CoverWrapper>
        {info.thumb_url && !imgError ? (
          <CoverImg src={info.thumb_url} alt="" loading="lazy" onError={() => setImgError(true)} />
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
    </Card>
  );
}

export default DiscoverBookCard;
