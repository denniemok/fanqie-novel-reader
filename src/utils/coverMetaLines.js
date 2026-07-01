/** @returns {{ key: string, text: string }[]} */
export function getCoverMetaEntries(sortBy, {
  score,
  lastPublishTime,
  wordCount,
  category,
  chapterCount,
  convertedWordCount,
  convertedCategory,
}) {
  switch (sortBy) {
    case 'default':
    case 'manual':
      return (convertedCategory || category)
        ? [{ key: 'category', text: convertedCategory || category }]
        : [];
    case 'rating':
      return score ? [{ key: 'score', text: `評分 ${score}` }] : [];
    case 'update':
      return lastPublishTime
        ? [{ key: 'update', text: `更新 ${lastPublishTime}` }]
        : [];
    case 'chapters':
      return [{
        key: 'chapters',
        text: chapterCount ? `共 ${chapterCount} 章節` : '暫無章節資訊',
      }];
    case 'words':
      return (convertedWordCount || wordCount)
        ? [{ key: 'words', text: `${convertedWordCount || wordCount}字` }]
        : [];
    default:
      return [];
  }
}
