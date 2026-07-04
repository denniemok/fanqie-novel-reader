import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Check, Plus, Minus } from 'lucide-react';
import {
  Modal,
  ModalTitleBar,
  ModalBody,
  ModalFooter,
  ModalInput,
  ModalPrimaryButton,
} from '../ui/ModalBase';
import EmptyHint from '../ui/EmptyHint';

const CollectionOption = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: ${(p) => (p.$checked ? 'rgba(212, 165, 116, 0.15)' : 'var(--background-color)')};
  border: 1px solid ${(p) => (p.$checked ? 'var(--accent-color)' : 'var(--border-color)')};
  color: var(--text-color);
  font-size: 13px;
  font-family: inherit;
  cursor: ${(p) => (p.$locked ? 'default' : 'pointer')};
  text-align: left;
  transition: all 0.1s steps(2);
  opacity: ${(p) => (p.$locked ? 0.92 : 1)};

  &:hover {
    border-color: ${(p) => (p.$locked ? (p.$checked ? 'var(--accent-color)' : 'var(--border-color)') : 'var(--accent-color)')};
    background: ${(p) => (p.$locked ? (p.$checked ? 'rgba(212, 165, 116, 0.15)' : 'var(--background-color)') : 'var(--hover-background-color)')};
  }

  .check {
    width: 16px;
    height: 16px;
    color: var(--accent-color);
    flex-shrink: 0;
  }
`;

const MultiCollectionRow = styled.div`
  display: flex;
  align-items: stretch;
  border: 1px solid var(--border-color);
  background: var(--background-color);
  overflow: hidden;
`;

const MultiCollectionName = styled.div`
  flex: 1;
  min-width: 0;
  padding: 10px 12px;
  font-size: 13px;
  font-family: inherit;
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-shadow: inset -1px 0 0 var(--border-color);

  .check {
    width: 16px;
    height: 16px;
    color: var(--accent-color);
    flex-shrink: 0;
  }
`;

const MultiActionGroup = styled.div`
  display: flex;
  align-items: stretch;
  flex-shrink: 0;
`;

const MultiActionBtn = styled.button`
  padding: 0;
  width: 40px;
  min-height: 40px;
  box-sizing: border-box;
  margin: 0;
  border: none;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-color2);
  color: var(--text-color-secondary);
  transition: background 0.1s steps(2), color 0.1s steps(2);

  & + & {
    box-shadow: inset 1px 0 0 var(--border-color);
  }

  ${(p) => p.$active && p.$tone === 'add' && `
    background: #55aa55;
    color: var(--text-on-accent);
  `}

  ${(p) => p.$active && p.$tone === 'remove' && `
    background: #aa5555;
    color: var(--text-on-accent);
  `}

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover:not(:disabled) {
    filter: brightness(1.06);
  }

  &:active:not(:disabled) {
    filter: brightness(0.96);
  }
`;

function CollectionModal({
  bookIds,
  collections,
  newCollectionName,
  onNewCollectionNameChange,
  onClose,
  onToggleBooks,
  onCreateCollection,
  showAllOption = false,
  allBookIds = [],
  onToggleAll,
}) {
  const ids = (Array.isArray(bookIds) ? bookIds : [bookIds]).map(String);
  const isMulti = ids.length > 1;
  const title = isMulti ? `加入收藏夾（${ids.length} 本）` : '加入收藏夾';
  const [multiAction, setMultiAction] = useState({});
  const allLocked = showAllOption && ids.some((id) =>
    collections.some((col) => col.bookIds.includes(id))
  );
  const allChecked = allLocked || allBookIds.includes(ids[0]);

  useEffect(() => {
    setMultiAction({});
  }, [ids.join(',')]);

  const handleSingleCollectionClick = async (col) => {
    const currentlyIn = col.bookIds.includes(ids[0]);
    await onToggleBooks(col.id, ids, !currentlyIn);
  };

  const handleMultiAdd = async (col) => {
    await onToggleBooks(col.id, ids, true);
    setMultiAction((prev) => ({ ...prev, [col.id]: 'add' }));
  };

  const handleMultiRemove = async (col) => {
    await onToggleBooks(col.id, ids, false);
    setMultiAction((prev) => ({ ...prev, [col.id]: 'remove' }));
  };

  const handleAllClick = async () => {
    if (allLocked) return;
    const currentlyIn = allBookIds.includes(ids[0]);
    await onToggleAll?.(ids, !currentlyIn);
  };

  const handleMultiAllAdd = async () => {
    await onToggleAll?.(ids, true);
    setMultiAction((prev) => ({ ...prev, __all__: 'add' }));
  };

  const handleMultiAllRemove = async () => {
    if (allLocked) return;
    await onToggleAll?.(ids, false);
    setMultiAction((prev) => ({ ...prev, __all__: 'remove' }));
  };

  const allOption = showAllOption ? (
    isMulti ? (
      allLocked ? (
        <MultiCollectionRow key="__all__">
          <MultiCollectionName title="全部">
            <span>全部</span>
            <Check className="check" />
          </MultiCollectionName>
        </MultiCollectionRow>
      ) : (
        <MultiCollectionRow key="__all__">
          <MultiCollectionName title="全部">全部</MultiCollectionName>
          <MultiActionGroup>
            <MultiActionBtn
              type="button"
              $tone="add"
              $active={multiAction.__all__ === 'add'}
              onClick={handleMultiAllAdd}
              title="加入「全部」"
              aria-label="將所選書籍加入「全部」"
              aria-pressed={multiAction.__all__ === 'add'}
            >
              <Plus />
            </MultiActionBtn>
            <MultiActionBtn
              type="button"
              $tone="remove"
              $active={multiAction.__all__ === 'remove'}
              onClick={handleMultiAllRemove}
              title="從「全部」移除"
              aria-label="將所選書籍從「全部」移除"
              aria-pressed={multiAction.__all__ === 'remove'}
            >
              <Minus />
            </MultiActionBtn>
          </MultiActionGroup>
        </MultiCollectionRow>
      )
    ) : (
      <CollectionOption
        key="__all__"
        type="button"
        $checked={allChecked}
        $locked={allLocked}
        onClick={allLocked ? undefined : handleAllClick}
        disabled={allLocked}
        aria-disabled={allLocked}
      >
        全部
        {allChecked && <Check className="check" />}
      </CollectionOption>
    )
  ) : null;

  return (
    <Modal onClose={onClose}>
      <ModalTitleBar title={title} onClose={onClose} />
      <ModalBody>
        {collections.length === 0 && !showAllOption ? (
          <EmptyHint>尚無收藏夾，請先建立一個</EmptyHint>
        ) : (
          <>
            {allOption}
            {collections.map((col) => {
            if (isMulti) {
              const action = multiAction[col.id];
              return (
                <MultiCollectionRow key={col.id}>
                  <MultiCollectionName title={col.name}>{col.name}</MultiCollectionName>
                  <MultiActionGroup>
                    <MultiActionBtn
                      type="button"
                      $tone="add"
                      $active={action === 'add'}
                      onClick={() => handleMultiAdd(col)}
                      title="加入此收藏夾"
                      aria-label={`將所選書籍加入「${col.name}」`}
                      aria-pressed={action === 'add'}
                    >
                      <Plus />
                    </MultiActionBtn>
                    <MultiActionBtn
                      type="button"
                      $tone="remove"
                      $active={action === 'remove'}
                      onClick={() => handleMultiRemove(col)}
                      title="從此收藏夾移除"
                      aria-label={`將所選書籍從「${col.name}」移除`}
                      aria-pressed={action === 'remove'}
                    >
                      <Minus />
                    </MultiActionBtn>
                  </MultiActionGroup>
                </MultiCollectionRow>
              );
            }

            const checked = col.bookIds.includes(ids[0]);
            return (
              <CollectionOption
                key={col.id}
                $checked={checked}
                onClick={() => handleSingleCollectionClick(col)}
              >
                {col.name}
                {checked && <Check className="check" />}
              </CollectionOption>
            );
          })}
          </>
        )}
      </ModalBody>
      <ModalFooter $stretch>
        <ModalInput
          value={newCollectionName}
          onChange={(e) => onNewCollectionNameChange(e.target.value)}
          placeholder="新增收藏夾…"
          onKeyDown={(e) => { if (e.key === 'Enter') onCreateCollection(); }}
        />
        <ModalPrimaryButton type="button" onClick={onCreateCollection}>
          建立
        </ModalPrimaryButton>
      </ModalFooter>
    </Modal>
  );
}

export default CollectionModal;
