import styled from 'styled-components';
import { URGENT_NOTICE } from '../../data/announcements';

const Notice = styled.div`
  width: 100%;
  margin-bottom: 20px;
  box-sizing: border-box;
  padding: 14px 16px;
  background: color-mix(in srgb, var(--accent-color) 12%, var(--background-color2));
  border: var(--retro-border-width) solid var(--accent-color);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--retro-shadow);
  font-size: 14px;
  line-height: 1.65;
  color: var(--text-color);
  animation: fadeInUp 0.5s cubic-bezier(0.34, 1.4, 0.64, 1) backwards;
  animation-delay: 0.04s;
`;

const Label = styled.strong`
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--accent-color);
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

function UrgentNotice() {
  if (!URGENT_NOTICE) return null;

  return (
    <Notice role="alert">
      <Label>緊急通知（{URGENT_NOTICE.date}）</Label>
      <Message>{URGENT_NOTICE.message}</Message>
    </Notice>
  );
}

export default UrgentNotice;
