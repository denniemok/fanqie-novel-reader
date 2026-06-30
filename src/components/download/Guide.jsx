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
    body: '目錄頁的「下載全部」一次只會排程一本書。若在其他書籍再啟動下載全部，會取代目前的排程。',
  },
  {
    tag: '單章下載',
    body: `手動下載單章時，最多同時進行 ${MAX_CONCURRENT_DOWNLOADS} 個章節，可跨不同書籍。`,
  },
  {
    tag: '速率限制',
    body: `為保障所有使用者，請求速率限制為每分鐘 ${RATE_LIMIT_RPM} 次。下載全部時每批之間會暫停 ${batchCooldownSec} 秒。`,
  },
  {
    tag: '離線閱讀',
    body: '已下載的章節儲存在本機 IndexedDB，不受瀏覽器 localStorage 容量限制。',
  },
  {
    tag: '匯出 TXT',
    body: '目錄頁或下載頁可匯出已下載章節為 .txt 檔；未下載的章節不會包含在內。章節一律按正序排列，繁簡轉換依頂部語言設定。',
  },
  {
    tag: '節制使用',
    body: '請求會經由共用代理轉發，過度下載可能影響自己與其他讀者的使用體驗。',
  },
];

function Guide() {
  return (
    <Section>
      <SectionTitle>使用說明</SectionTitle>
      {GUIDE_ITEMS.map((item) => (
        <InfoCard key={item.tag}>
          <b>{item.tag}</b>
          {item.body}
        </InfoCard>
      ))}
    </Section>
  );
}

export default Guide;
