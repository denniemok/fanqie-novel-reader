import React from 'react';
import TopBarBase from '../common/TopBarBase';
import ApiDropdown, { API_DROPDOWN_TITLE } from '../common/ApiDropdown';
import LangDropdown, { LANG_DROPDOWN_TITLE } from '../common/LangDropdown';

function NewBookTopBar({ conversionMode, onConversionModeChange }) {
  return (
    <TopBarBase>
      <ApiDropdown title={API_DROPDOWN_TITLE} />
      <LangDropdown title={LANG_DROPDOWN_TITLE} value={conversionMode} onChange={onConversionModeChange} />
    </TopBarBase>
  );
}

export default NewBookTopBar;
