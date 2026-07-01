import styled from 'styled-components';
import {
  MAX_CONCURRENT_DOWNLOADS,
  BATCH_COOLDOWN_MS,
  RATE_LIMIT_RPM,
} from '../../utils/constants';
import { retroTagCardStyles } from '../../utils/styled/retro';
import { Section, SectionTitle } from '../../utils/styled/sections';

const InfoCard = styled.div`
  ${retroTagCardStyles}

  ul {
    margin: 8px 0 0;
    padding-left: 1.2em;
  }

  li + li {
    margin-top: 6px;
  }
`;

const batchCooldownSec = BATCH_COOLDOWN_MS / 1000;

const GUIDE_ITEMS = [
  {
    tag: '下載全部',
    body: '一次只能排程一本書喔！如果在別本書點了「下載全部」，會取代目前的排程。',
  },
  {
    tag: '單章下載',
    body: `手動點擊單章下載時，最多可以同時下載 ${MAX_CONCURRENT_DOWNLOADS} 章，不同書也可以一起下。`,
  },
  {
    tag: '速率限制',
    body: `為了讓大家都能順暢使用，每分鐘最多請求 ${RATE_LIMIT_RPM} 次。使用「下載全部」時，每批會稍微休息 ${batchCooldownSec} 秒。`,
  },
  {
    tag: '離線閱讀',
    body: '下載好的章節會安全地存在您的裝置裡，不用擔心瀏覽器容量不夠喔！',
  },
  {
    tag: '匯出 TXT',
    body: '您可以把下載好的章節匯出成 .txt 檔。內容會照順序排好，繁簡體也會跟著您目前的設定走。',
  },
  {
    tag: '溫柔使用',
    body: '大家的下載都是透過共用伺服器處理的，請酌量下載，留點頻寬給其他書友喔！',
  },
];

function Guide() {
  return (
    <Section>
      <SectionTitle>使用說明</SectionTitle>
      {GUIDE_ITEMS.map((item) => (
        <InfoCard key={item.tag}>
          <b>{item.tag}</b> {item.body}
        </InfoCard>
      ))}
    </Section>
  );
}

export default Guide;
