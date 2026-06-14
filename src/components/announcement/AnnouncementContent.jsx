import React from 'react';
import styled from 'styled-components';
import NoticeBoard from '../home/NoticeBoard';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-top: calc(100px + env(safe-area-inset-top));
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: calc(40px + env(safe-area-inset-bottom));
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 480px) {
    padding-top: calc(88px + env(safe-area-inset-top));
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: calc(24px + env(safe-area-inset-bottom));
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
