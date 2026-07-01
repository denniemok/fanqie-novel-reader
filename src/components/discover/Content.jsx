import React from 'react';
import PageContent from '../common/PageContent';
import DiscoverBooks from './DiscoverBooks';

function Content({ conversionMode = 'tw' }) {
  return (
    <PageContent>
      <DiscoverBooks conversionMode={conversionMode} />
    </PageContent>
  );
}

export default Content;
