import React from 'react';
import PageContent from '../common/PageContent';
import Progress from './Progress';
import Guide from './Guide';

function Content({ conversionMode = 'tw' }) {
  return (
    <PageContent $paddingBottom={48} $paddingBottomMobile={32}>
      <Progress conversionMode={conversionMode} />
      <Guide />
    </PageContent>
  );
}

export default Content;
