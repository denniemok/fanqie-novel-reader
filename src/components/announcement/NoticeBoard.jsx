import styled from 'styled-components';
import EmptyHint from '../common/EmptyHint';
import { retroDashedCardStyles, retroTagStyles } from '../../utils/styled/retro';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const NoticeCard = styled.div`
  ${retroDashedCardStyles}
  ${retroTagStyles}
  font-family: inherit;
  transition: var(--transition-default);

  @media (hover: hover) {
    &:hover {
      border-color: color-mix(in srgb, var(--accent-color) 40%, var(--border-color));
      transform: translateX(2px);
    }
  }

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

function NoticeBoard({ announcements }) {
  if (!announcements.length) return <EmptyHint>暫無公告</EmptyHint>;

  return (
    <Section>
      {announcements.map((item, index) => (
        <NoticeCard key={`${item.date}-${index}`}>
          <b>{item.date}</b> {item.message}
        </NoticeCard>
      ))}
    </Section>
  );
}

export default NoticeBoard;
