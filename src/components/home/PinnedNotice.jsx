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
    border-bottom: 1px solid color-mix(in srgb, var(--accent-color) 40%, transparent);
    line-height: 1.3;
    vertical-align: baseline;
    transition: border-color 0.2s ease;

    &:hover {
      border-bottom-color: var(--accent-color);
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
