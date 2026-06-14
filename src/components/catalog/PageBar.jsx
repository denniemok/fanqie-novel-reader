import { useState, useRef, useEffect } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import styled from 'styled-components';

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px dashed var(--border-color);

  &:last-child {
    border-bottom: none;
    border-top: 1px dashed var(--border-color);
  }
`;

const PaginationGroup = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  min-width: 40px;
  min-height: 40px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--background-color2);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: var(--hover-background-color);
    border-color: var(--accent-color);
    color: var(--accent-color);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const PageTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 96px;
  max-width: 100%;
  min-height: 40px;
  padding: 4px 24px 4px 10px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--background-color2);
  color: var(--text-color);
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.2s ease;
  text-align: left;
  box-sizing: border-box;

  &:hover {
    border-color: var(--accent-color);
  }

  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`;

const TriggerText = styled.span`
  flex: 1;
  min-width: 0;
  line-height: 1.1;
`;

const PageLine = styled.span`
  display: block;
  font-size: 14px;
  line-height: 1.2;
  color: var(--text-color);
  white-space: nowrap;
`;

const OptionLine = styled.span`
  display: block;
  font-size: 14px;
  line-height: 1.2;
  color: var(--text-color);
  white-space: nowrap;
`;

const RangeBracket = styled.span`
  color: var(--text-color-secondary);
  font-size: 13px;
`;

const SelectChevron = styled(ChevronDown)`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: var(--text-color-secondary);
  pointer-events: none;
`;

const PageMenu = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  min-width: 100%;
  width: max-content;
  max-height: 280px;
  overflow-y: auto;
  background-color: rgba(18, 18, 18, 0.98);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 1100;
  padding: 8px;
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;

  ${(p) =>
    p.$openUpward
      ? `
    bottom: calc(100% + 8px);
    top: auto;
  `
      : `
    top: calc(100% + 8px);
    bottom: auto;
  `}

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    margin: 4px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 999px;
  }

  @media (hover: hover) {
    &::-webkit-scrollbar-thumb:hover {
      background: var(--text-color-secondary);
    }
  }
`;

const PageOption = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 40px;
  padding: 10px 12px;
  text-align: left;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  font-family: inherit;
  color: var(--text-color);
  box-sizing: border-box;

  @media (hover: hover) {
    &:hover {
      background-color: var(--hover-background-color);

      ${OptionLine} {
        color: var(--accent-color);
      }
    }
  }

  ${(p) =>
    p.$active &&
    `
    background-color: var(--hover-background-color);

    ${OptionLine} {
      color: var(--accent-color);
      font-weight: 600;
    }
  `}
`;

function PageOptionLabel({ pageNumber, rangeStart, rangeEnd, showRange = false }) {
  if (showRange) {
    return (
      <OptionLine>
        第 {pageNumber} 頁{' '}
        <RangeBracket>( {rangeStart} - {rangeEnd} )</RangeBracket>
      </OptionLine>
    );
  }

  return <PageLine>第 {pageNumber} 頁</PageLine>;
}

function PageDropdown({ pageOptions, currentPage, onPageSelect, openUpward = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = pageOptions.find((opt) => opt.value === String(currentPage)) ?? pageOptions[0];

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <SelectWrapper ref={ref}>
      <PageTrigger
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`第 ${selected.pageNumber} 頁，${selected.rangeStart} - ${selected.rangeEnd}`}
      >
        <TriggerText>
          <PageOptionLabel pageNumber={selected.pageNumber} />
        </TriggerText>
        <SelectChevron size={14} aria-hidden="true" />
      </PageTrigger>
      {open && (
        <PageMenu role="listbox" aria-label="章節頁面" $openUpward={openUpward}>
          {pageOptions.map((opt) => (
            <PageOption
              key={opt.value}
              type="button"
              role="option"
              aria-selected={opt.value === String(currentPage)}
              $active={opt.value === String(currentPage)}
              onClick={() => {
                onPageSelect(Number(opt.value));
                setOpen(false);
              }}
            >
              <PageOptionLabel
                pageNumber={opt.pageNumber}
                rangeStart={opt.rangeStart}
                rangeEnd={opt.rangeEnd}
                showRange
              />
            </PageOption>
          ))}
        </PageMenu>
      )}
    </SelectWrapper>
  );
}

function PageBar({
  currentPage,
  pageOptions,
  canGoPrev,
  canGoNext,
  onPagePrev,
  onPageNext,
  onPageSelect,
  sortOrder,
  onSortChange,
  menuOpensUp = false,
}) {
  const showPagination = pageOptions.length > 1;

  const sortButton = (
    <NavButton
      type="button"
      title={sortOrder === 'ascending' ? '升序排列' : '降序排列'}
      onClick={onSortChange}
      style={sortOrder === 'descending' ? { color: 'var(--accent-color)' } : undefined}
    >
      {sortOrder === 'ascending' ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
    </NavButton>
  );

  return (
    <Bar>
      <PaginationGroup>
        {showPagination ? (
          <>
            <NavButton type="button" title="上一頁" onClick={onPagePrev} disabled={!canGoPrev}>
              <ChevronLeft size={18} />
            </NavButton>
            <PageDropdown
              pageOptions={pageOptions}
              currentPage={currentPage}
              onPageSelect={onPageSelect}
              openUpward={menuOpensUp}
            />
            {sortButton}
            <NavButton type="button" title="下一頁" onClick={onPageNext} disabled={!canGoNext}>
              <ChevronRight size={18} />
            </NavButton>
          </>
        ) : (
          sortButton
        )}
      </PaginationGroup>
    </Bar>
  );
}

export default PageBar;
