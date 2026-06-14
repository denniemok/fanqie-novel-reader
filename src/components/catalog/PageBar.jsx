import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';
import styled from 'styled-components';
import SelectDropdown from '../common/SelectDropdown';

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
