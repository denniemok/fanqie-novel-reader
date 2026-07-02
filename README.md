# 🍅 番茄繁體閱讀

<p align="left">
  <img src="https://img.shields.io/github/stars/denniemok/fanqie-novel-reader?style=for-the-badge&color=yellow" alt="Stars">
  <img src="https://img.shields.io/github/v/release/denniemok/fanqie-novel-reader?style=for-the-badge&color=blue" alt="Release">
  <img src="https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/demo-fanqietc.com-orange.svg?style=for-the-badge" alt="Demo">
</p>

### 🌟 專為繁體讀者打造的番茄小說閱讀器

這是一款專為受夠廣告干擾、且追求高品質繁簡轉換的讀者所打造的極簡閱讀工具。

藉由 OpenCC 詞彙級轉換，我們賦予每一行文字最道地的繁體語感。透過深度優化排版與字體，我們為同樣追求純粹的你，打造一個安靜、精緻且數據完全本地化的閱讀空間。

### 👉 **立即體驗**：[https://fanqietc.com](https://fanqietc.com)

<br>

## 📸 介面預覽

> [!TIP]
> 專為電子書愛好者深度優化的「黑夜模式」與高品質繁體排版。

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

## ✨ 核心優勢

- **🔓 零門檻：** 無需註冊安裝，不受應用程式商店地域封鎖限制，網頁開啟即讀。
- **🔍 探索新書：** 內建搜尋、榜單與推薦，也可直接貼上網址或書籍 ID 開始閱讀。
- **🔤 專業繁簡轉換：** 提供詞彙級別精準轉換，支援臺灣繁體、香港繁體與原文簡體三種模式。
- **🌓 護眼深度優化：** 預設高品質暗黑模式，字體、背景與亮度均可微調，適合長時間沈浸閱讀。
- **🚫 徹底零廣告：** 物理性過濾所有廣告與追蹤器，還你一個更純淨、更專注的閱讀空間。
- **📦 下載與匯出：** 支援背景異步預載，並可將小說匯出為 TXT 或 EPUB，方便放入 Kindle、Kobo 等電子書閱讀器。
- **📡 API 狀態監控：** 即時檢測各鏡像源健康狀態，並可在設定中手動切換 API 來源。
- **📱 PWA 支援：** 可安裝至手機桌面或電腦，享受類原生 App 的流暢操作與離線閱讀功能。
- **💾 本地數據隱私：** 閱讀紀錄與下載章節皆儲存在您的設備中，隱私百分之百由您掌控。

<br>

## 🧩 快速上手

無需複雜操作，以下任一方式即可開始閱讀：

**方式一：探索新書**
1. 從首頁進入「新書」頁面。
2. 透過搜尋、榜單或推薦找到感興趣的小說，點擊即可開讀。

**方式二：貼上網址或 ID**
1. 在 [番茄小說網](https://fanqienovel.com) 或 [Tomato MTL](https://tomatomtl.com) 複製小說網址（或記下書籍 ID）。
2. 進入「新書」→「其他」，將網址或 ID 貼入輸入框，點擊「開始閱讀」。

閱讀紀錄會自動保存於書架。

<br>

## 🚢 部署與開發

> [!CAUTION]
> 為確保第三方 API 的服務安全與穩定，後端代理服務暫不公開。前端可獨立構建部署，但需自行配置可用的後端位址。

本專案基於 **Vite + React 18** 構建，需要 **Node.js ≥ 16**。

```bash
# 安裝依賴
npm install

# 複製環境變數範本並填入後端位址
cp .env.example .env

# 本地開發（預設 http://localhost:5173）
npm run dev

# 構建生產版本（靜態檔案位於 dist/）
npm run build
```

**技術細節**：受 [fanqienovel-book](https://github.com/kailous/fanqienovel-book) 啟發重寫。前端透過後端代理中轉請求，調用多個番茄小說 API 鏡像進行資料檢索與處理。繁簡轉換由 [OpenCC](https://github.com/BYVoid/OpenCC) 在前端完成。

<br>

## 📁 專案結構

```
src/
├── components/         # UI 元件
│   ├── bookshelf/      # 書架與收藏
│   ├── catalog/        # 章節目錄
│   ├── chapter/        # 閱讀器
│   ├── discover/       # 新書探索（搜尋、榜單、推薦）
│   ├── settings/       # 設定面板
│   └── …
├── contexts/           # React Context（主題、下載、轉換模式等）
├── hooks/              # 自訂 Hooks（api、book、discover 等）
├── pages/              # 路由頁面
├── services/           # API 與探索服務
└── utils/              # 工具函式（匯出、快取、繁簡轉換等）
```

<br>

## 💡 注意事項

> [!IMPORTANT]
> 本專案依賴第三方 API 提供服務，請在使用前詳閱以下說明。資源珍貴，請節制使用。

- 由於使用第三方接口，服務可能隨時變更或失效。若發現應用無法正常運行，可至 [Issues](https://github.com/denniemok/fanqie-novel-reader/issues) 頁面回報。
- 若遇到章節下載失敗，可能是 API 暫時性過載或維護中，請稍候再試。
- 請勿短時間內頻繁調用，建議單次下載不超過 **500 章**，以減輕伺服器壓力。

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

官方 App 雖然方便，但生硬的簡繁轉換與不斷跳出的廣告，總是在精彩處讓人出戲。這個專案的初衷，就是為了營造一個更舒適、專注的繁體閱讀空間。

**如果你也喜歡這份純粹，請點個 ⭐ 支持我的持續維護！**

歡迎至 [Issues](https://github.com/denniemok/fanqie-novel-reader/issues) 提出建議或回報問題。
