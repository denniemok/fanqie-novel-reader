export function buildNovelDataFromDirectory(itemId, bookId, itemDataList) {
  const list = itemDataList || [];
  const index = list.findIndex((item) => String(item.item_id) === String(itemId));
  
  if (index < 0) return null;
  
  const item = list[index];
  const prevItem = list[index - 1];
  const nextItem = list[index + 1];
  
  return {
    book_id: bookId,
    title: item.title,
    order: String(index + 1),
    serial_count: String(list.length),
    pre_item_id: prevItem?.item_id ?? null,
    next_item_id: nextItem?.item_id ?? null,
  };
}
