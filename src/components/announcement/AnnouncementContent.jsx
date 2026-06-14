import React from 'react';
import styled from 'styled-components';
import NoticeBoard from '../common/NoticeBoard';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-top: calc(76px + 48px + env(safe-area-inset-top));
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 48px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding-top: calc(68px + 32px + env(safe-area-inset-top));
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 32px;
  }
`;

function AnnouncementContent() {
  return (
    <Wrapper>
      <NoticeBoard />
    </Wrapper>
  );
}

export default AnnouncementContent;
