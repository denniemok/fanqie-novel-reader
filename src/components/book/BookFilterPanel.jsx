import { useMemo } from 'react';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import styled from 'styled-components';
import { toolbarRetroUnit } from '../../utils/styled/retro';
import {
  computeBookFilterOptionCounts,
  EMPTY_BOOK_FILTERS,
  STATUS_FILTER_OPTIONS,
  WORD_COUNT_FILTER_OPTIONS,
} from '../../utils/book/bookFilters';
import { maybeConvert } from '../../utils/text/zh-convert';
import { HorizontalScrollArea, HorizontalScrollInner } from '../ui/HorizontalScrollArea';

const PanelRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 0;
`;

const ToggleBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  min-height: 36px;
  padding: 0 12px;
  border: var(--retro-border-width) solid var(--border-color);
  background: var(--background-color2);
  color: var(--text-color-secondary);
  font-size: 13px;
  font-weight: 700;
  font-family: var(--ui-font-family);
  cursor: pointer;
  box-shadow: var(--retro-shadow);
  transition: var(--transition-default);

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  svg.chevron {
    transition: transform 0.2s ease;

    &.open {
      transform: rotate(180deg);
    }
  }

  &:hover {
    color: var(--text-color);
    border-color: var(--accent-color);
    transform: translate(-1px, -1px);
    box-shadow: var(--retro-shadow-hover);
  }
`;

const ActiveFilters = styled(HorizontalScrollInner)`
  align-items: center;
  gap: 6px;
  flex: 1;
`;

const ActiveTag = styled.span`
  flex-shrink: 0;
  padding: 4px 10px;
  border: 1px solid color-mix(in srgb, var(--accent-color) 45%, var(--border-color));
  background: color-mix(in srgb, var(--accent-color) 12%, var(--background-color2));
  color: var(--accent-color);
  font-size: 12px;
  font-weight: 600;
  font-family: var(--ui-font-family);
  white-space: nowrap;
`;

const ClearBtn = styled.button`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--text-color-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    color: var(--accent-color);
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 14px;
  ${toolbarRetroUnit}
  background: color-mix(in srgb, var(--background-color2) 48%, transparent);
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const Label = styled.span`
  flex-shrink: 0;
  min-width: 3.2em;
  padding-top: 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-color-secondary);
  letter-spacing: 0.03em;
`;

const Options = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
  min-width: 0;
`;

const Chip = styled.button`
  padding: 5px 12px;
  border: 1px solid var(--border-color);
  background: ${(p) => (p.$active ? 'var(--accent-color)' : 'var(--background-color2)')};
  color: ${(p) => (p.$active ? 'var(--text-on-accent)' : 'var(--text-color-secondary)')};
  font-size: 13px;
  font-weight: 600;
  font-family: var(--ui-font-family);
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;

  &:hover {
    background: ${(p) => (p.$active ? 'var(--accent-hover)' : 'var(--hover-background-color)')};
    color: ${(p) => (p.$active ? 'var(--text-on-accent)' : 'var(--text-color)')};
    border-color: var(--accent-color);
  }
`;

function FilterRow({ label, options, value, onChange, optionCounts }) {
  return (
    <Row>
      <Label>{label}：</Label>
      <Options>
        {options.map((option) => {
          const count = optionCounts?.[option.value || ''];
          return (
            <Chip
              key={option.value || 'all'}
              type="button"
              $active={value === option.value}
              onClick={() => onChange(option.value)}
            >
              {option.label}
              {count != null && ` (${count})`}
            </Chip>
          );
        })}
      </Options>
    </Row>
  );
}

function getActiveFilterLabels(filters, categoryOptions, conversionMode) {
  const labels = [];

  if (filters.category) {
    const category = categoryOptions.find((option) => option.value === filters.category);
    labels.push(category?.label || maybeConvert(filters.category, conversionMode));
  }
  if (filters.status) {
    const status = STATUS_FILTER_OPTIONS.find((option) => option.value === filters.status);
    if (status) labels.push(maybeConvert(status.label, conversionMode));
  }
  if (filters.wordCount) {
    const wordCount = WORD_COUNT_FILTER_OPTIONS.find((option) => option.value === filters.wordCount);
    if (wordCount) labels.push(maybeConvert(wordCount.label, conversionMode));
  }

  return labels;
}

function BookFilterPanel({
  categories = [],
  filters = EMPTY_BOOK_FILTERS,
  conversionMode = 'tw',
  onFiltersChange,
  expanded = false,
  onExpandedChange,
  filterItems,
  getFilterMeta,
  filteredCount,
}) {
  const categoryOptions = [
    { value: '', label: '全部' },
    ...categories.map((category) => ({
      value: category,
      label: maybeConvert(category, conversionMode),
    })),
  ];

  const setFilter = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const activeFilterLabels = useMemo(
    () => getActiveFilterLabels(filters, categoryOptions, conversionMode),
    [filters, categoryOptions, conversionMode]
  );

  const categoryCounts = useMemo(() => {
    if (!filterItems || !getFilterMeta) return null;
    return computeBookFilterOptionCounts(
      filterItems,
      getFilterMeta,
      filters,
      categoryOptions,
      'category'
    );
  }, [filterItems, getFilterMeta, filters, categoryOptions]);

  const statusCounts = useMemo(() => {
    if (!filterItems || !getFilterMeta) return null;
    return computeBookFilterOptionCounts(
      filterItems,
      getFilterMeta,
      filters,
      STATUS_FILTER_OPTIONS,
      'status'
    );
  }, [filterItems, getFilterMeta, filters]);

  const wordCountCounts = useMemo(() => {
    if (!filterItems || !getFilterMeta) return null;
    return computeBookFilterOptionCounts(
      filterItems,
      getFilterMeta,
      filters,
      WORD_COUNT_FILTER_OPTIONS,
      'wordCount'
    );
  }, [filterItems, getFilterMeta, filters]);

  const showActiveFilters = activeFilterLabels.length > 0;

  const clearFilters = () => {
    onFiltersChange(EMPTY_BOOK_FILTERS);
  };

  return (
    <PanelRoot>
      <ToggleRow>
        <ToggleBtn
          type="button"
          onClick={() => onExpandedChange(!expanded)}
          aria-expanded={expanded}
          aria-controls="book-filter-panel"
        >
          <SlidersHorizontal aria-hidden />
          篩選
          {filteredCount != null && ` (${filteredCount})`}
          <ChevronDown className={`chevron${expanded ? ' open' : ''}`} aria-hidden />
        </ToggleBtn>

        {showActiveFilters && (
          <HorizontalScrollArea as={ActiveFilters} aria-label="已選篩選">
            {activeFilterLabels.map((label) => (
              <ActiveTag key={label}>{label}</ActiveTag>
            ))}
          </HorizontalScrollArea>
        )}

        {showActiveFilters && (
          <ClearBtn
            type="button"
            onClick={clearFilters}
            title="清除篩選"
            aria-label="清除篩選"
          >
            <X aria-hidden />
          </ClearBtn>
        )}
      </ToggleRow>

      {expanded && (
        <Body id="book-filter-panel">
          <FilterRow
            label="分類"
            options={categoryOptions}
            value={filters.category}
            onChange={(value) => setFilter('category', value)}
            optionCounts={categoryCounts}
          />
          <FilterRow
            label="狀態"
            options={STATUS_FILTER_OPTIONS}
            value={filters.status}
            onChange={(value) => setFilter('status', value)}
            optionCounts={statusCounts}
          />
          <FilterRow
            label="字數"
            options={WORD_COUNT_FILTER_OPTIONS}
            value={filters.wordCount}
            onChange={(value) => setFilter('wordCount', value)}
            optionCounts={wordCountCounts}
          />
        </Body>
      )}
    </PanelRoot>
  );
}

export default BookFilterPanel;
