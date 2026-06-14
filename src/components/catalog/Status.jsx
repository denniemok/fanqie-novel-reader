import React from 'react';
import styled from 'styled-components';
import { Check, X, Loader2 } from 'lucide-react';
import { CardSpinningIcon } from '../common/CardActionButton';

const StatusWrapper = styled.span`
  display: flex;
  margin-right: 6px;
`;

function Status({ isDownloading, isCached }) {
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

  return (
    <StatusWrapper>
      <X size={18} color="var(--text-color-secondary)" />
    </StatusWrapper>
  );
}

export default Status;
