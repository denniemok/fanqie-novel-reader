import React from 'react';
import PageContent from '../common/PageContent';
import NoticeBoard from './NoticeBoard';

function Content() {
  return (
    <PageContent $paddingBottom={48} $paddingBottomMobile={32}>
      <NoticeBoard />
    </PageContent>
  );
}

export default Content;
