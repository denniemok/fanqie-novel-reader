import React from 'react';
import PageContent from '../common/PageContent';
import DownloadStatus from './DownloadStatus';
import DownloadGuide from './DownloadGuide';

function Content() {
  return (
    <PageContent $paddingBottom={48} $paddingBottomMobile={32}>
      <DownloadStatus />
      <DownloadGuide />
    </PageContent>
  );
}

export default Content;
