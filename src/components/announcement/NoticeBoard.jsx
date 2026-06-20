import styled from 'styled-components';
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

const ANNOUNCEMENTS = [
  {
    date: '2026-06-20',
    message: '目前所有 API 服務暫時無法使用，站長正在設法修復中。造成不便，敬請見諒。',
  },
  {
    date: '2026-06-20',
    message: '書架批次刷新改進：刷新失敗時，錯誤訊息會直接顯示在對應書籍卡片上（例如「目錄與書籍詳情均無法更新，已顯示快取內容」），並以提示摘要顯示成功與失敗本數。錯誤將保留至該書刷新成功或刪除為止。',
  },
  {
    date: '2026-06-16',
    message: '新增下載頁：首頁可進入，顯示下載狀態、進度與使用說明。目錄「下載全部」會詢問是否前往下載頁；書架管理模式下選取單本書籍可一鍵下載全部並跳轉。下載頁支援匯出 TXT，章節一律按正序排列，繁簡轉換依語言設定。',
  },
  {
    date: '2026-06-16',
    message: '書架管理模式大改版：點擊書籍可多選，底部浮動工具列支援全選、刷新、加入收藏夾與批次刪除。收藏夾管理移至獨立彈窗，可新增、重新命名、排序及刪除收藏夾。格狀視圖調序模式改為頂部拖曳橫條。書架新增搜尋欄，支援依書名或作者篩選。分頁顯示書籍數量。',
  },
  {
    date: '2026-06-14',
    message: '首頁全面重新設計，新增書架、新書探索、公告欄與問題回報四個主要入口，方便快速導覽。書架功能大幅強化：支援依名稱、作者、閱讀時間等多種方式排序；新增格狀視圖模式，以封面縮圖展示書籍；收藏夾管理支援建立多個自訂分類，並可隨時將書籍移入或移出。整體佈局更直覺，適合管理大量書籍。',
  },
  {
    date: '2026-04-06',
    message: '新增多組第三方 API 服務選項，可在設定中自由切換，提升整體穩定性與可用性。閱讀歷史功能改版，由自動按時間排序改為支援手動拖曳排序，方便將常讀書籍置頂。當尚無閱讀紀錄時，首頁將顯示預設範例書籍，協助新使用者快速了解操作流程。',
  },
  {
    date: '2026-03-25',
    message: '書籍詳情頁與目錄改為並行同時載入，大幅縮短等待時間，不再依序等待各區塊回應。當部分資料載入失敗時，系統會於對應區塊顯示簡短提示，其他正常載入的區塊仍可正常使用，不影響整體閱讀體驗。',
  },
  {
    date: '2026-03-25',
    message: '修正最新版本第三方 API 服務因端點變更導致無法正常使用的問題。更新請求格式與服務位址，確保書籍搜尋、目錄載入及章節內容讀取恢復正常運作。若先前遭遇錯誤，可重新整理頁面後再試。',
  },
  {
    date: '2026-03-23',
    message: '批次下載（下載全部章節）功能新增強制冷卻間隔，每次請求之間加入延遲，以較慢的速度逐章下載。此調整旨在避免短時間內大量請求衝擊 API 服務，影響其他使用者的正常讀取，感謝理解與配合。',
  },
  {
    date: '2026-03-22',
    message: '所有 API 請求現已透過負載均衡代理伺服器轉發，將流量分散至多個後端節點，提升整體可用性與響應速度。惟共用資源有限，請避免頻繁批次操作，以確保每位使用者均能獲得穩定服務。若發現異常緩慢，請稍候片刻後再試。',
  },
  {
    date: '2026-03-21',
    message: '目錄頁新增章節排序切換功能，可在正序（第一章至最新章）與倒序（最新章至第一章）之間自由切換，並記憶上次選擇。進入書籍時，系統一律先導向目錄頁，不再自動跳轉至最新章節，讓使用者自行決定從哪裡繼續閱讀。',
  },
  {
    date: '2026-03-13',
    message: '移除長期無法使用且無法恢復的 API 服務選項，精簡設定介面，避免使用者誤選後反覆遭遇失敗。各服務選項現標示其可用範圍（如僅支援部分地區、僅支援搜尋或僅支援章節讀取），方便對照選用。同步改善全域錯誤訊息，提供更具體的失敗原因提示。',
  },
  {
    date: '2026-03-10',
    message: '章節閱讀頁頂部新增調色盤切換按鈕，提供七種預設背景色彩（包含米色、暖黃、淡綠、深灰等），適應不同閱讀環境與個人偏好。選擇較淺的背景色時，系統將自動切換文字為深色模式，確保對比度與可讀性，設定即時生效並自動儲存至本地。',
  },
  {
    date: '2026-03-10',
    message: '全站介面進行大規模視覺改版，採用復古極簡風格設計語言，以虛線邊框、低飽和色調與方角卡片構成整體視覺風格。內文改用明體（宋體）字型，提升長篇閱讀舒適度；閱讀版面更為簡潔，移除多餘裝飾元素，讓內容成為主角。深色模式同步更新配色方案。',
  },
  {
    date: '2026-03-10',
    message: '繁簡轉換選項由原本的切換開關改為三段式下拉選單，可選擇「原文簡體」、「臺灣繁體」（使用臺灣慣用詞彙）或「香港繁體」（使用港式用語），預設為臺灣繁體。切換後無需重新整理頁面，所有已載入的內容將同步更新。',
  },
  {
    date: '2026-03-09',
    message: '章節快取儲存機制從 localStorage 升級至 IndexedDB，解除原先約 5–10 MB 的容量上限。IndexedDB 可儲存數百 MB 甚至更多資料，理論上可快取整本書的所有章節。已讀取的章節將自動快取，再次進入時無需重新請求 API，大幅加快載入速度並支援離線閱讀。',
  },
];

function NoticeBoard() {
  return (
    <Section>
      {ANNOUNCEMENTS.map((item) => (
        <NoticeCard key={`${item.date}-${item.message}`}>
          <b>{item.date}</b> {item.message}
        </NoticeCard>
      ))}
    </Section>
  );
}

export default NoticeBoard;
