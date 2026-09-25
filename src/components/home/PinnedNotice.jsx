import styled from 'styled-components';
import { useAnnouncements } from '../../hooks/useAnnouncements';
import { HomeNotice, HomeNoticeLabel } from './HomeNotice';

const Notice = styled(HomeNotice)`
  margin-top: 12px;
`;

const Message = styled.p`
  margin: 0;

  a {
    display: inline-block;
    color: var(--accent-color);
    text-decoration: none;
    border: 1px solid var(--accent-color);
    padding: 0px 6px 1px;
    line-height: 1.2;
    vertical-align: baseline;
    background: var(--background-color2);

    &:hover {
      background: var(--accent-color);
      color: var(--text-on-accent);
    }
  }
`;

function PinnedNotice() {
  const { pinnedNotices } = useAnnouncements();

  if (!pinnedNotices.length) return null;

  return pinnedNotices.map((notice, index) => (
    <Notice key={`${notice.date}-${index}`} role="alert">
      <HomeNoticeLabel>置頂公告（{notice.date}）</HomeNoticeLabel>
      <Message>{notice.message}</Message>
    </Notice>
  ));
}

export default PinnedNotice;
