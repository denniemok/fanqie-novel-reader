import React from 'react';
import PageContent from '../common/PageContent';
import NoticeBoard from './NoticeBoard';

function Content({ announcements }) {
  return (
    <PageContent $paddingBottom={48} $paddingBottomMobile={32}>
      <NoticeBoard announcements={announcements} />
    </PageContent>
  );
}

export default Content;
