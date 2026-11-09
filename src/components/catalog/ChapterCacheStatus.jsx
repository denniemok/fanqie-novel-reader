import React from 'react';
import styled from 'styled-components';
import { Check, Loader2 } from 'lucide-react';
import { CardSpinningIcon } from '../book/CardActionButton';

const StatusWrapper = styled.span`
  display: flex;
  margin-right: 6px;
`;

function ChapterCacheStatus({ isDownloading, isCached }) {
  if (isDownloading) {
    return (
      <StatusWrapper>
        <CardSpinningIcon $duration="1s">
          <Loader2 size={18} />
        </CardSpinningIcon>
      </StatusWrapper>
    );
  }

  if (isCached) {
    return (
      <StatusWrapper>
        <Check size={18} color="var(--accent-color)" />
      </StatusWrapper>
    );
  }

  // Not downloaded is the normal state: show nothing rather than an "✕" that reads like delete.
  return null;
}

export default ChapterCacheStatus;
