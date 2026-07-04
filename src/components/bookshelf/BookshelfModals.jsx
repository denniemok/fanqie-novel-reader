import CollectionModal from '../collection/CollectionModal';
import CollectionManagementModal from '../collection/CollectionManagementModal';
import ConfirmModal from '../ui/ConfirmModal';
import ExportBookModalHost from '../export/ExportBookModalHost';
import { getCatalogSortDirection } from '../../utils/storage';

function BookshelfModals({
  showCollectionManagement,
  collections,
  activeTab,
  onCloseCollectionManagement,
  onCreateCollectionInManagement,
  onRenameCollectionInManagement,
  onDeleteCollectionInManagement,
  onCollectionsReorder,
  addToCollectionBookIds,
  newCollectionName,
  onNewCollectionNameChange,
  onCloseAddToCollection,
  onToggleBooksInCollection,
  onCreateCollectionFromModal,
  confirmDialog,
  onConfirmDialog,
  onCloseConfirmDialog,
  exportBookId,
  conversionMode,
  displayVariant,
  showToast,
  onCloseExport,
}) {
  return (
    <>
      {showCollectionManagement && (
        <CollectionManagementModal
          collections={collections}
          activeTab={activeTab}
          onClose={onCloseCollectionManagement}
          onCreateCollection={onCreateCollectionInManagement}
          onRenameCollection={onRenameCollectionInManagement}
          onDeleteCollection={onDeleteCollectionInManagement}
          onReorderCollections={onCollectionsReorder}
        />
      )}

      {addToCollectionBookIds && (
        <CollectionModal
          bookIds={addToCollectionBookIds}
          collections={collections}
          newCollectionName={newCollectionName}
          onNewCollectionNameChange={onNewCollectionNameChange}
          onClose={onCloseAddToCollection}
          onToggleBooks={onToggleBooksInCollection}
          onCreateCollection={onCreateCollectionFromModal}
        />
      )}

      {confirmDialog && (
        <ConfirmModal
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmLabel={confirmDialog.confirmLabel}
          onConfirm={onConfirmDialog}
          onCancel={onCloseConfirmDialog}
        />
      )}

      <ExportBookModalHost
        open={Boolean(exportBookId)}
        bookId={exportBookId}
        defaultSortOrder={getCatalogSortDirection()}
        defaultConversionMode={conversionMode}
        defaultDisplayVariant={displayVariant}
        showToast={showToast}
        onClose={onCloseExport}
      />
    </>
  );
}

export default BookshelfModals;
