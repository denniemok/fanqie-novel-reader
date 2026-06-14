import React from 'react';
import TopBarBase from '../common/TopBarBase';
import HomeButton, { HOME_BUTTON_TITLE } from '../common/HomeButton';
import NewBookButton, { NEW_BOOK_BUTTON_TITLE } from '../common/NewBookButton';
import ApiDropdown, { API_DROPDOWN_TITLE } from '../common/ApiDropdown';
import LangDropdown, { LANG_DROPDOWN_TITLE } from '../common/LangDropdown';

function BookshelfTopBar({ conversionMode, onConversionModeChange }) {
  return (
    <TopBarBase>
      <HomeButton title={HOME_BUTTON_TITLE} />
      <NewBookButton title={NEW_BOOK_BUTTON_TITLE} />
      <ApiDropdown title={API_DROPDOWN_TITLE} />
      <LangDropdown title={LANG_DROPDOWN_TITLE} value={conversionMode} onChange={onConversionModeChange} />
    </TopBarBase>
  );
}

export default BookshelfTopBar;
