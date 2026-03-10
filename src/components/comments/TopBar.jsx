import React from 'react';
import { RefreshCw } from 'lucide-react';
import TopBarBase from '../common/TopBarBase';
import HomeButton from '../common/HomeButton';
import CatalogButton from '../common/CatalogButton';
import ApiSourceDropdown from '../common/ApiSourceDropdown';
import ConversionDropdown from '../common/ConversionDropdown';
import { IconButton } from '../common/IconButton';

function TopBar({ bookId, conversionMode, onConversionModeChange, onRefresh }) {
  return (
    <TopBarBase>
      <HomeButton />
      <ApiSourceDropdown />
      <ConversionDropdown value={conversionMode} onChange={onConversionModeChange} />
      <IconButton type="button" title="重新載入評論" onClick={onRefresh}>
        <RefreshCw size={20} strokeWidth={2.5} />
      </IconButton>
      <CatalogButton bookId={bookId} />
    </TopBarBase>
  );
}

export default TopBar;
