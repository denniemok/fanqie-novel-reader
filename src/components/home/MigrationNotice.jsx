import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CANONICAL_HOSTNAME, CANONICAL_SITE_URL } from '../../utils/constants';
import { isLegacyOrigin } from '../../utils/dataMigration';
import { ROUTES } from '../../utils/navigation';
import { GrayButton } from '../ui/GrayButton';
import { HomeNotice, HomeNoticeLabel } from './HomeNotice';

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
    <HomeNotice role="status">
      <HomeNoticeLabel>網站搬家囉！</HomeNoticeLabel>
      <Message>
        我們已經搬到{' '}
        <SiteLink href={CANONICAL_SITE_URL} target="_blank" rel="noopener noreferrer">
          {CANONICAL_HOSTNAME}
        </SiteLink>
        。記得先匯出資料再到新站匯入，讓您的書架和閱讀紀錄跟著一起搬過去喔！
      </Message>
      <GrayButton type="button" onClick={() => navigate(ROUTES.export)}>
        前往匯出資料
      </GrayButton>
    </HomeNotice>
  );
}

export default MigrationNotice;
