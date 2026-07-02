import ExportBookModal from './ExportBookModal';

/** Conditionally renders ExportBookModal when open and bookId are set. */
function ExportBookModalHost({
  open,
  bookId,
  bookInfo,
  defaultSortOrder,
  defaultConversionMode,
  defaultDisplayVariant,
  showToast,
  onClose,
}) {
  if (!open || !bookId) return null;

  return (
    <ExportBookModal
      bookId={bookId}
      bookInfo={bookInfo}
      defaultSortOrder={defaultSortOrder}
      defaultConversionMode={defaultConversionMode}
      defaultDisplayVariant={defaultDisplayVariant}
      showToast={showToast}
      onClose={onClose}
    />
  );
}

export default ExportBookModalHost;
