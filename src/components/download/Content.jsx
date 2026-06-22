import React from 'react';
import PageContent from '../common/PageContent';
import Progress from './Progress';
import Guide from './Guide';

function Content() {
  return (
    <PageContent $paddingBottom={48} $paddingBottomMobile={32}>
      <Progress />
      <Guide />
    </PageContent>
  );
}

export default Content;
