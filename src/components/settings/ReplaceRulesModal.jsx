import React, { useState } from 'react';
import styled from 'styled-components';
import { ArrowRight, Plus, Trash2 } from 'lucide-react';
import {
  Modal,
  ModalTitleBar,
  ModalBody,
  ModalText,
  ModalFooter,
  ModalInput,
  ModalPrimaryButton,
  ModalSecondaryButton,
} from '../ui/ModalBase';
import { useReplaceRules } from '../../hooks/useConversionMode';
import { useToast } from '../../contexts/ToastContext';
import { REPLACE_RULES_MAX, REPLACE_RULE_TEXT_MAX } from '../../utils/constants';

const AddForm = styled.form`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;

  > svg {
    color: var(--text-color-secondary);
  }

  @media (max-width: 400px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);

    > svg {
      display: none;
    }

    > button {
      grid-column: 1 / -1;
    }
  }
`;

const AddButton = styled(ModalPrimaryButton)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 9px 14px;
`;

const RuleList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
`;

const RuleRow = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 6px 6px 12px;
  font-size: 14px;
  color: var(--text-color);

  & + & {
    border-top: 1px solid var(--border-color);
  }

  > svg {
    flex-shrink: 0;
    color: var(--text-color-secondary);
  }
`;

const RuleText = styled.span`
  min-width: 0;
  overflow-wrap: anywhere;
  color: ${(p) => (p.$muted ? 'var(--text-color-secondary)' : 'inherit')};
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  margin-left: auto;
  padding: 0;
  color: var(--text-color-secondary);
  background: transparent;
  border: none;
  border-radius: var(--border-radius-xs);
  cursor: pointer;
  transition: var(--transition-default);

  @media (hover: hover) {
    &:hover {
      color: var(--toast-error-color);
      background: var(--hover-background-color);
    }
  }
`;

function ReplaceRulesModal({ onClose }) {
  const { replaceRules, setReplaceRules } = useReplaceRules();
  const { notifyError } = useToast();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const trimmedFrom = from.trim();
  const isUpdate = replaceRules.some((rule) => rule.from === trimmedFrom);
  const atLimit = replaceRules.length >= REPLACE_RULES_MAX && !isUpdate;
  const canAdd = Boolean(trimmedFrom) && trimmedFrom !== to.trim() && !atLimit;

  const save = async (rules) => {
    const ok = await setReplaceRules(rules);
    if (!ok) notifyError(null, '無法儲存替換規則，請稍後再試。');
    return ok;
  };

  const handleAdd = async (event) => {
    event.preventDefault();
    if (!canAdd) return;
    // normalizeReplaceRules keeps the last rule per `from`, so this also updates an existing one.
    if (await save((current) => [...current, { from: trimmedFrom, to: to.trim() }])) {
      setFrom('');
      setTo('');
    }
  };

  const handleDelete = (target) => {
    save((current) => current.filter((rule) => rule.from !== target));
  };

  return (
    <Modal onClose={onClose} maxWidth="420px">
      <ModalTitleBar title="自訂替換" onClose={onClose} />
      <ModalBody>
        <ModalText>
          繁簡轉換後，把書名、正文、評論等內容中的文字換成你指定的寫法，例如把「計程車兵」換成「的士兵」。所有轉換模式都適用，「替換為」留空即刪除該文字。
        </ModalText>
        <AddForm onSubmit={handleAdd}>
          <ModalInput
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="原文"
            aria-label="原文"
            maxLength={REPLACE_RULE_TEXT_MAX}
          />
          <ArrowRight size={16} strokeWidth={2.5} aria-hidden />
          <ModalInput
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="替換為"
            aria-label="替換為"
            maxLength={REPLACE_RULE_TEXT_MAX}
          />
          <AddButton type="submit" disabled={!canAdd}>
            <Plus size={16} strokeWidth={2.5} aria-hidden />
            {isUpdate ? '更新' : '新增'}
          </AddButton>
        </AddForm>
        {atLimit && <ModalText>已達 {REPLACE_RULES_MAX} 條上限，請先刪除部分規則。</ModalText>}
        {replaceRules.length > 0 ? (
          <RuleList aria-label="替換規則">
            {[...replaceRules].reverse().map((rule) => (
              <RuleRow key={rule.from}>
                <RuleText>{rule.from}</RuleText>
                <ArrowRight size={14} strokeWidth={2.5} aria-hidden />
                <RuleText $muted={!rule.to}>{rule.to || '（刪除）'}</RuleText>
                <DeleteButton
                  type="button"
                  onClick={() => handleDelete(rule.from)}
                  title="刪除規則"
                  aria-label={`刪除規則：${rule.from}`}
                >
                  <Trash2 size={16} strokeWidth={2.5} aria-hidden />
                </DeleteButton>
              </RuleRow>
            ))}
          </RuleList>
        ) : (
          <ModalText>尚未新增規則。</ModalText>
        )}
      </ModalBody>
      <ModalFooter>
        <ModalSecondaryButton type="button" onClick={onClose}>
          返回設定
        </ModalSecondaryButton>
      </ModalFooter>
    </Modal>
  );
}

export default ReplaceRulesModal;
