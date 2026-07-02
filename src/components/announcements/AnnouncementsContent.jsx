import React from 'react';
import PageContent from '../layout/PageContent';
import NoticeBoard from './NoticeBoard';

function AnnouncementsContent({ announcements }) {
  return (
    <PageContent $paddingBottom={48} $paddingBottomMobile={32}>
      <NoticeBoard announcements={announcements} />
    </PageContent>
  );
}

export default AnnouncementsContent;
