import { ArrowDownZA, ArrowUpAZ, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import styled from 'styled-components';
import SelectDropdown from '../common/SelectDropdown';

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px dashed color-mix(in srgb, var(--border-color) 80%, transparent);
  background: color-mix(in srgb, var(--background-color2) 35%, transparent);

  &:last-child {
    border-bottom: none;
    border-top: 1px dashed color-mix(in srgb, var(--border-color) 80%, transparent);
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
  padding: 0;
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  border-radius: 0;
  border: var(--retro-border-width) solid color-mix(in srgb, var(--border-color) 85%, transparent);
  background: color-mix(in srgb, var(--background-color2) 48%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: var(--text-color);
  cursor: pointer;
  box-shadow: var(--retro-shadow);
  transition: all 0.1s steps(2);
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: color-mix(in srgb, var(--catalog-glass-hover) 75%, transparent);
    border-color: var(--accent-color);
    color: var(--accent-color);
    transform: translate(-1px, -1px);
    box-shadow: var(--retro-shadow-hover);
  }

  &:active:not(:disabled) {
    transform: translate(1px, 1px);
    box-shadow: none;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${(p) =>
    p.$active &&
    `
    background: var(--accent-color);
    border-color: var(--accent-color);
    color: var(--text-on-accent);
  `}

  ${(p) =>
    p.$active &&
    `
    &:hover:not(:disabled) {
      background: var(--accent-hover);
      border-color: var(--accent-hover);
      color: var(--text-on-accent);
    }
  `}

  svg {
    width: 18px;
    height: 18px;
  }
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
  const selected = pageOptions.find((opt) => opt.value === String(currentPage)) ?? pageOptions[0];

  return (
    <SelectDropdown
      options={pageOptions}
      value={String(currentPage)}
      onChange={(next) => onPageSelect(Number(next))}
      ariaLabel={`第 ${selected.pageNumber} 頁，${selected.rangeStart} - ${selected.rangeEnd}`}
      menuAriaLabel="章節頁面"
      openUpward={openUpward}
      square
      retro
      triggerMinHeight={40}
      renderValue={(opt) => <PageOptionLabel pageNumber={opt.pageNumber} />}
      renderOption={(opt) => (
        <PageOptionLabel
          pageNumber={opt.pageNumber}
          rangeStart={opt.rangeStart}
          rangeEnd={opt.rangeEnd}
          showRange
        />
      )}
    />
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
  manageMode = false,
  onManageModeToggle,
  showManageToggle = false,
}) {
  const showPagination = pageOptions.length > 1;

  const manageButton = showManageToggle && onManageModeToggle && (
    <NavButton
      type="button"
      title={manageMode ? '退出管理' : '管理章節'}
      aria-label={manageMode ? '退出管理' : '管理章節'}
      aria-pressed={manageMode}
      $active={manageMode}
      onClick={onManageModeToggle}
    >
      <Settings size={18} />
    </NavButton>
  );

  const sortButton = (
    <NavButton
      type="button"
      title={sortOrder === 'ascending' ? '升序排列' : '降序排列'}
      onClick={onSortChange}
      style={sortOrder === 'descending' ? { color: 'var(--accent-color)' } : undefined}
    >
      {sortOrder === 'ascending' ? <ArrowUpAZ size={18} /> : <ArrowDownZA size={18} />}
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
            {manageButton}
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
          <>
            {manageButton}
            {sortButton}
          </>
        )}
      </PaginationGroup>
    </Bar>
  );
}

export default PageBar;
