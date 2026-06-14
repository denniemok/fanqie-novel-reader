import React from 'react';
import TopBarBase from '../common/TopBarBase';
import HomeButton, { HOME_BUTTON_TITLE } from '../common/HomeButton';
import BookshelfButton, { BOOKSHELF_BUTTON_TITLE } from '../common/BookshelfButton';
import ApiDropdown, { API_DROPDOWN_TITLE } from '../common/ApiDropdown';
import LangDropdown, { LANG_DROPDOWN_TITLE } from '../common/LangDropdown';

function NewBookTopBar({ conversionMode, onConversionModeChange }) {
  return (
    <TopBarBase>
      <HomeButton title={HOME_BUTTON_TITLE} />
      <BookshelfButton title={BOOKSHELF_BUTTON_TITLE} />
      <ApiDropdown title={API_DROPDOWN_TITLE} />
      <LangDropdown title={LANG_DROPDOWN_TITLE} value={conversionMode} onChange={onConversionModeChange} />
    </TopBarBase>
  );
}

export default NewBookTopBar;
