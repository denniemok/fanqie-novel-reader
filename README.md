# 🍅 番茄繁體閱讀

<p align="left">
  <img src="https://img.shields.io/github/stars/denniemok/fanqie-novel-reader?style=for-the-badge&color=yellow" alt="Stars">
  <img src="https://img.shields.io/github/v/release/denniemok/fanqie-novel-reader?style=for-the-badge&color=blue" alt="Release">
  <img src="https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/demo-fanqietc.pages.dev-orange.svg?style=for-the-badge" alt="Demo">
</p>

### 🌟 專為繁體讀者打造的番茄小說閱讀器

這是一款專為受夠廣告干擾、且追求高品質繁簡轉換的讀者所打造的極簡閱讀工具。

藉由 OpenCC 詞彙級轉換，我們賦予每一行文字最道地的繁體語感；透過深度優化排版與字體，我們為同樣追求純粹的你，打造一個安靜、精緻且數據完全本地化的閱讀空間。

### 👉 **立即體驗**：[https://fanqietc.pages.dev](https://fanqietc.pages.dev)

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

- **🔓 零門檻** — 無需註冊安裝，不受應用程式商店地域封鎖限制，網頁開啟即讀。
- **🔤 專業繁簡轉換** — 提供詞彙級別精準轉換，修正生硬的字對字翻轉，尊重地域慣用語習慣。
- **🌓 護眼深度優化** — 預設高品質暗黑模式，字體、背景與亮度均可微調，適合長時間沈浸閱讀。
- **🚫 徹底零廣告** — 物理性過濾所有廣告與追蹤器，還你一個更純淨、更專注的閱讀空間。
- **📦 下載與匯出** — 支援背景異步預載，並可將小說匯出為 TXT 格式，方便放入 Kindle、Kobo 等電子書閱讀器。
- **📱 PWA 支援** — 可安裝至手機桌面或電腦，享受類原生 App 的流暢操作與離線閱讀功能。
- **💾 本地數據隱私** — 數據不經過伺服器，皆儲存在您的設備中，隱私百分之百由您掌控。

<br>

## 🧩 快速上手

無需複雜操作，只需三步即可開始閱讀：
1. **複製網址**：在 [番茄小說網](https://fanqienovel.com) 找到喜歡的小說，複製瀏覽器網址。
2. **直接貼上**：將網址直接貼入本工具的輸入框，點擊「開始閱讀」。
3. **享受閱讀**：系統自動解析 ID 並載入，歷史紀錄會自動保存於本地。

> [!TIP]
> 你也可以只輸入書籍 ID (例如 `7234567890`)，系統同樣能秒速識別。

<br>

## 🚢 部署與開發

> [!CAUTION]
> 為確保第三方 API 的服務安全與穩定，核心調用邏輯暫不開放原始碼。敬請見諒！

本專案基於 **Vite + React** 構建，純前端實現，無需後端，可一鍵部署至任何靜態託管平台。

```bash
# 本地開發
npm install
npm run dev # 開啟 http://localhost:5173 即可

# 構建生產版本 (靜態檔案位於 dist/)
npm run build
```

**技術細節**：受 [fanqienovel-book](https://github.com/kailous/fanqienovel-book) 啟發重寫，應用會以負載平衡方式接入閉源代理端，透過中轉請求調用 [番茄小說 API](https://github.com/POf-L/Fanqie-novel-Downloader) 進行資料檢索與處理。

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
