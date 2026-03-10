# 🍅 番茄小說繁體中文閱讀器

<p align="left">
  <img src="https://img.shields.io/github/stars/denniemok/fanqie-novel-reader?style=for-the-badge&color=yellow" alt="Stars">
  <img src="https://img.shields.io/github/v/release/denniemok/fanqie-novel-reader?style=for-the-badge&color=blue" alt="Release">
  <img src="https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/demo-fanqietc.pages.dev-orange.svg?style=for-the-badge" alt="Demo">
</p>

### 🌟擺脫手機號束縛 · 告別廣告干擾 · 專為「繁體閱讀」而生

這是一個為了解決繁體中文用戶、無中國手機號、以及受夠了廣告干擾的番茄小說讀者而打造的極簡閱讀工具。透過深度優化繁轉品質與閱讀介面，讓小說回歸純粹。

- **🔓 零門檻**：免註冊、免安裝、免中國手機號，打開即用。
- **🚫 零廣告**：徹底粉碎所有視覺噪音，還你最純粹的閱讀空間。
- **📖 繁體優化**：內建專業級轉換，尊重地域慣用語，提供最舒適的閱讀感。
- **⚡ 極速下載**：高性能多線程並發預載，萬字長篇瞬間匯出 TXT。

### 👉 **立即使用**：[https://fanqietc.pages.dev](https://fanqietc.pages.dev)

<br>

## 📸 介面預覽

> [!TIP]
> **專注於細節**：針對電子書愛好者深度優化的「黑夜模式」與字體排版。

<p align="center">
  <img src="https://i.imgur.com/tyPeahq.gif" width="97%" alt="Demo">
</p>

<p align="center">
  <img src="https://i.imgur.com/iQXBAwn.png" width="24%" alt="書架">
  <img src="https://i.imgur.com/qzPLZly.png" width="24%" alt="目錄">
  <img src="https://i.imgur.com/NW1p9bj.png" width="24%" alt="評論">
  <img src="https://i.imgur.com/4Fu72Do.png" width="24%" alt="閱讀">
</p>

<br>

## ✨ 核心功能

- **🚀 智能解析** — 全面支援**直接貼入番茄網址**，自動提取書籍 ID。
- **🌓 護眼設計** — 自由調整字體類型、亮度與大小，長時間閱讀不疲勞。
- **📦 下載管理** — 支援**背景異步預載**，享受流暢無斷點的閱讀體驗。
- **📑 導出 TXT** — 隨時將已下載章節匯出為標準 TXT 格式，方便放入電子書閱讀器。
- **💬 社群同步** — 支援查看小說實時評分與精彩評論。
- **💾 本地存檔** — 利用瀏覽器快取儲存書架與進度，刷新頁面不丟失。
- **📱 PWA 體驗** — 可安裝至手機桌面或電腦，體驗類原生 App 的離線閱讀功能。
- **🔤 繁簡轉換** — 整合 **OpenCC** 技術，提供**上下文關聯、詞彙級別**的精準轉換，完美相容台灣與香港的地域慣用詞彙。

<br>

## 🧩 快速上手

無需複雜操作，只需三步即可開始閱讀：
1. **複製網址**：在 [番茄小說網](https://fanqienovel.com) 找到喜歡的小說，直接複製瀏覽器地址欄的網址。
2. **直接貼上**：將網址直接貼入本工具的輸入框，點擊「開始閱讀」。
3. **享受閱讀**：系統自動解析書籍 ID 並載入，歷史紀錄會自動保存，隨時繼續。

> [!TIP]
> 你也可以只輸入書籍 ID (例如 `7234567890`)，系統同樣能秒速識別。

<br>

## 🚢 部署與開發

本專案基於 **Vite + React** 構建，純前端實現，無需後端，可一鍵部署至任何靜態託管平台。

```bash
# 本地開發
npm install
npm run dev # 開啟 http://localhost:5173 即可

# 構建生產版本 (靜態檔案位於 dist/)
npm run build
```

- **部署建議**：可部署至 Vercel, Netlify, GitHub Pages 或 Cloudflare Pages。
- **技術細節**：應用直接呼叫番茄小說 API，API 由 Fanqie-novel-Downloader 提供。

> [!NOTE]
> **致敬與感謝**：
>  - 受 [fanqienovel-book](https://github.com/kailous/fanqienovel-book) 啟發重寫。
>  - API 由 [Fanqie-novel-Downloader](https://github.com/POf-L/Fanqie-novel-Downloader) 提供。

<br>

## 📁 專案結構

```
src/
├── components/         # UI 元件 (book, catalog, chapter, etc.)
├── contexts/           # 狀態管理 (下載, Toast)
├── hooks/              # 自訂 Hooks
├── pages/              # 頁面元件
├── services/           # API 請求
└── utils/              # 工具函式
```

<br>

## ⚠️ 免責聲明

- 本專案僅供技術交流與個人學習使用。
- 使用者應遵守當地法律法規及原網站之服務條款。
- 所有內容版權均歸原作者及番茄小說所有，請支持正版。

<br>

## 📋 授權條款

本專案採用 [MIT 授權](LICENSE)。使用本專案原始碼時請保留授權聲明並註明出處。

<br>

## 💡 開發者碎碎念

這個專案的誕生，源於一個簡單的困擾：身為繁體中文讀者，我只想好好讀一本番茄小說，卻被「中國手機號註冊」與「滿載的廣告」擋在門外。

我相信閱讀不該有門檻，更不該在簡繁轉換的生硬字句中消磨樂趣。於是我親手打造了這個工具，希望能為同樣遇到困擾的你，提供一個安靜、純粹且高品質的閱讀空間。

**如果你也喜歡這份純粹，請點個 ⭐ Star 支持我的持續維護！**

歡迎至 [GitHub Issues](https://github.com/denniemok/fanqie-novel-reader/issues) 提出建議或回報問題。
