import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CANONICAL_HOSTNAME, CANONICAL_SITE_URL } from '../../utils/constants';
import { isLegacyOrigin } from '../../utils/dataMigration';
import { ROUTES } from '../../utils/navigation';
import { GrayButton } from '../common/GrayButton';

const Notice = styled.div`
  width: 100%;
  margin-bottom: 16px;
  box-sizing: border-box;
  padding: 14px 16px;
  background: color-mix(in srgb, var(--accent-color) 8%, var(--background-color2));
  border: var(--retro-border-width) solid color-mix(in srgb, var(--accent-color) 55%, var(--border-color));
  border-radius: var(--border-radius-sm);
  box-shadow: var(--retro-shadow);
  font-size: 14px;
  line-height: 1.65;
  color: var(--text-color);
  animation: fadeInUp 0.5s cubic-bezier(0.34, 1.4, 0.64, 1) backwards;
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
  margin: 0 0 12px;
`;

const SiteLink = styled.a`
  color: var(--accent-color);
  text-decoration: none;
  border-bottom: 1px solid color-mix(in srgb, var(--accent-color) 40%, transparent);

  &:hover {
    border-bottom-color: var(--accent-color);
  }
`;

function MigrationNotice() {
  const navigate = useNavigate();

  if (!isLegacyOrigin()) return null;

  return (
    <Notice role="status">
      <Label>網站遷移</Label>
      <Message>
        我們已遷移至新網域{' '}
        <SiteLink href={CANONICAL_SITE_URL} target="_blank" rel="noopener noreferrer">
          {CANONICAL_HOSTNAME}
        </SiteLink>
        ，建議您盡快切換並匯出本機資料後匯入新站，以保留閱讀紀錄、書架與已下載章節。
      </Message>
      <GrayButton type="button" onClick={() => navigate(ROUTES.export)}>
        遷移資料
      </GrayButton>
    </Notice>
  );
}

export default MigrationNotice;
