import React from 'react';
import TopBarBase from '../common/TopBarBase';
import HomeButton, { HOME_BUTTON_TITLE } from '../common/HomeButton';
import BookshelfButton, { BOOKSHELF_BUTTON_TITLE } from '../common/BookshelfButton';
import NewBookButton, { NEW_BOOK_BUTTON_TITLE } from '../common/NewBookButton';
import LangDropdown, { LANG_DROPDOWN_TITLE } from '../common/LangDropdown';

function AnnouncementTopBar({ conversionMode, onConversionModeChange }) {
  return (
    <TopBarBase>
      <HomeButton title={HOME_BUTTON_TITLE} />
      <BookshelfButton title={BOOKSHELF_BUTTON_TITLE} />
      <NewBookButton title={NEW_BOOK_BUTTON_TITLE} />
      <LangDropdown title={LANG_DROPDOWN_TITLE} value={conversionMode} onChange={onConversionModeChange} />
    </TopBarBase>
  );
}

export default AnnouncementTopBar;
