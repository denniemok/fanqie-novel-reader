import React from 'react';
import PageContent from '../layout/PageContent';
import DiscoverBooks from './DiscoverBooks';

function DiscoverContent({ conversionMode = 'tw' }) {
  return (
    <PageContent>
      <DiscoverBooks conversionMode={conversionMode} />
    </PageContent>
  );
}

export default DiscoverContent;
