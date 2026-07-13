import CollectionModal from '../collection/CollectionModal';
import CollectionManagementModal from '../collection/CollectionManagementModal';
import ConfirmModal from '../ui/ConfirmModal';
import DownloadAllConfirmModal from '../catalog/DownloadAllConfirmModal';
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
  downloadConfirm,
  onCloseDownloadConfirm,
  onStartDownloadStay,
  onStartDownloadGoToPage,
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

      {downloadConfirm && (
        <DownloadAllConfirmModal
          chapterCount={downloadConfirm.chapterCount}
          stayLabel="留在書架"
          onStay={onStartDownloadStay}
          onGoToDownloadPage={onStartDownloadGoToPage}
          onClose={onCloseDownloadConfirm}
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
