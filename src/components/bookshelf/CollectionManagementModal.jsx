import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Check, Edit2, GripVertical, Trash2, X } from 'lucide-react';
import {
  Modal,
  ModalTitleBar,
  ModalBody,
  ModalScrollRegion,
  ModalFooter,
  ModalInput,
  ModalPrimaryButton,
  ModalText,
} from '../ui/ModalBase';
import ConfirmModal from '../ui/ConfirmModal';
import SortableBooks from './SortableBooks';
import EmptyHint from '../ui/EmptyHint';

const Hint = styled.p`
  margin: 0 0 8px;
  font-size: 12px;
  color: var(--text-color-secondary);
  line-height: 1.5;
`;

const CollectionRow = styled.div`
  display: flex;
  align-items: stretch;
  border: 1px solid var(--border-color);
  background: var(--background-color);
  overflow: hidden;

  ${(p) => p.$isDragging && `
    outline: 2px dashed var(--accent-color);
    outline-offset: -2px;
  `}
`;

const DragHandle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  align-self: stretch;
  background: var(--background-color2);
  border-right: 1px solid var(--border-color);
  color: var(--text-color-secondary);
  touch-action: none;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;

  &:active {
    cursor: grabbing;
    color: var(--accent-color);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const RowMain = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
`;

const RowName = styled.div`
  flex: 1;
  min-width: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RowMeta = styled.span`
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-color-secondary);
`;

const RowInput = styled.input`
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  padding: 6px 8px;
  background: var(--background-color);
  border: 1px solid var(--accent-color);
  color: var(--text-color);
  font-size: 13px;
  font-family: var(--ui-font-family);
  outline: none;
`;

const RowActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

const IconBtn = styled.button`
  padding: 0;
  width: 32px;
  height: 32px;
  box-sizing: border-box;
  border: 1px solid var(--border-color);
  background: ${(p) => {
    if (p.$variant === 'delete') return '#aa5555';
    if (p.$variant === 'confirm') return '#55aa55';
    if (p.$variant === 'cancel') return '#aa5555';
    return 'var(--background-color2)';
  }};
  color: ${(p) => (p.$variant ? 'var(--text-on-accent)' : 'var(--text-color)')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.1s steps(2);

  svg {
    width: 15px;
    height: 15px;
  }

  &:hover {
    filter: brightness(1.08);
  }
`;

function CollectionManagementModal({
  collections,
  activeTab,
  onClose,
  onCreateCollection,
  onRenameCollection,
  onDeleteCollection,
  onReorderCollections,
}) {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [listKey, setListKey] = useState(0);
  const editInputRef = useRef(null);

  useEffect(() => {
    if (editingId) {
      setTimeout(() => editInputRef.current?.focus(), 0);
    }
  }, [editingId]);

  const startEdit = (col) => {
    setEditingId(col.id);
    setEditingName(col.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const confirmEdit = async () => {
    if (!editingId || !editingName.trim()) return;
    await onRenameCollection(editingId, editingName.trim());
    cancelEdit();
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await onCreateCollection(newName.trim());
    setNewName('');
  };

  const handleReorder = async (fromIndex, toIndex) => {
    await onReorderCollections(fromIndex, toIndex);
    setListKey((k) => k + 1);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await onDeleteCollection(deleteTarget.id, deleteTarget.name);
    if (editingId === deleteTarget.id) cancelEdit();
    setDeleteTarget(null);
  };

  return (
    <>
      <Modal onClose={onClose} maxWidth="420px">
        <ModalTitleBar title="管理收藏夾" onClose={onClose} />
        <ModalBody $scroll={false}>
          <Hint>拖曳左側握把以調整收藏夾順序</Hint>
          {collections.length === 0 ? (
            <EmptyHint $compact>尚無收藏夾，請在下方建立一個</EmptyHint>
          ) : (
            <ModalScrollRegion>
              <SortableBooks
                key={listKey}
                layout="list"
                items={collections}
                getKey={(col) => col.id}
                onReorder={handleReorder}
                renderItem={(col, sortable) => (
                <CollectionRow $isDragging={sortable.isDragging}>
                  <DragHandle {...sortable.dragHandleProps} aria-label="拖曳排序">
                    <GripVertical />
                  </DragHandle>
                  <RowMain>
                    {editingId === col.id ? (
                      <RowInput
                        ref={editInputRef}
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') confirmEdit();
                          if (e.key === 'Escape') cancelEdit();
                        }}
                      />
                    ) : (
                      <>
                        <RowName title={col.name}>{col.name}</RowName>
                        <RowMeta>{col.bookIds.length} 本</RowMeta>
                      </>
                    )}
                    <RowActions>
                      {editingId === col.id ? (
                        <>
                          <IconBtn type="button" $variant="confirm" onClick={confirmEdit} title="確認">
                            <Check />
                          </IconBtn>
                          <IconBtn type="button" $variant="cancel" onClick={cancelEdit} title="取消">
                            <X />
                          </IconBtn>
                        </>
                      ) : (
                        <>
                          <IconBtn type="button" onClick={() => startEdit(col)} title="重新命名">
                            <Edit2 />
                          </IconBtn>
                          <IconBtn
                            type="button"
                            $variant="delete"
                            onClick={() => setDeleteTarget(col)}
                            title="刪除收藏夾"
                          >
                            <Trash2 />
                          </IconBtn>
                        </>
                      )}
                    </RowActions>
                  </RowMain>
                </CollectionRow>
              )}
                />
            </ModalScrollRegion>
          )}
        </ModalBody>
        <ModalFooter $stretch>
          <ModalInput
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="新增收藏夾…"
            onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
          />
          <ModalPrimaryButton type="button" onClick={handleCreate}>
            建立
          </ModalPrimaryButton>
        </ModalFooter>
      </Modal>

      {deleteTarget && (
        <ConfirmModal
          title="刪除收藏夾"
          message={(
            <ModalText>
              確定要刪除收藏夾「<strong>{deleteTarget.name}</strong>」嗎？
              {activeTab === deleteTarget.id && ' 刪除後將返回「全部」分頁。'}
            </ModalText>
          )}
          confirmLabel="刪除"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}

export default CollectionManagementModal;
