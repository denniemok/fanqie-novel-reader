import React from 'react';
import PageContent from '../layout/PageContent';
import DownloadProgress from './DownloadProgress';
import DownloadGuide from './DownloadGuide';

function DownloadContent({ conversionMode = 'tw' }) {
  return (
    <PageContent $paddingBottom={48} $paddingBottomMobile={32}>
      <DownloadProgress conversionMode={conversionMode} />
      <DownloadGuide />
    </PageContent>
  );
}

export default DownloadContent;
