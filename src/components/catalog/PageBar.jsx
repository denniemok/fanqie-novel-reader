import { ArrowDownZA, ArrowUpAZ, ChevronLeft, ChevronRight, ListChecks } from 'lucide-react';
import styled from 'styled-components';
import SelectDropdown from '../ui/SelectDropdown';
import { retroGlassControlBase, retroGlassControlHover, catalogInsetBarSurface, catalogDashedDividerBottom, catalogDashedDividerTop } from '../../utils/styled/retro';
import { DropdownOptionLine } from '../../utils/styled/dropdown';

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  ${catalogInsetBarSurface}
  ${catalogDashedDividerBottom}

  &:last-child {
    border-bottom: none;
    ${catalogDashedDividerTop}
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
  color: var(--text-color);
  cursor: pointer;
  flex-shrink: 0;
  ${retroGlassControlBase}
  ${retroGlassControlHover}

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

const PageLine = DropdownOptionLine;

const OptionLine = DropdownOptionLine;

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
}) {
  const manageButton = onManageModeToggle && (
    <NavButton
      type="button"
      title={manageMode ? '退出管理' : '管理章節'}
      aria-label={manageMode ? '退出管理' : '管理章節'}
      aria-pressed={manageMode}
      $active={manageMode}
      onClick={onManageModeToggle}
    >
      <ListChecks size={18} />
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
      </PaginationGroup>
    </Bar>
  );
}

export default PageBar;
