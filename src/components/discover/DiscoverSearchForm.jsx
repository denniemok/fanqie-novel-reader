import { Search, X } from 'lucide-react';
import {
  InlineSearchBar,
  SearchClearIconBtn,
  SearchForm,
  SearchSubmitBtn,
} from './styles';
import { SearchInput } from '../layout/BookToolbarStyles';

function DiscoverSearchForm({
  searchInput,
  submittedQuery,
  loading,
  onSearchInputChange,
  onSubmit,
  onClear,
}) {
  return (
    <SearchForm onSubmit={onSubmit}>
      <InlineSearchBar>
        <Search className="search-icon" aria-hidden />
        <SearchInput
          type="search"
          value={searchInput}
          onChange={onSearchInputChange}
          placeholder="輸入書名、作者或關鍵字"
          aria-label="搜尋書籍"
        />
        {searchInput && (
          <SearchClearIconBtn
            type="button"
            onClick={onClear}
            title="清除搜尋"
            aria-label="清除搜尋"
          >
            <X aria-hidden />
          </SearchClearIconBtn>
        )}
      </InlineSearchBar>
      <SearchSubmitBtn
        type="submit"
        disabled={!searchInput.trim() || loading || searchInput.trim() === submittedQuery}
      >
        搜尋
      </SearchSubmitBtn>
    </SearchForm>
  );
}

export default DiscoverSearchForm;
