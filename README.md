# 番茄小說閱讀器 (FQNR)

<p align="left">
  <img src="https://img.shields.io/github/stars/denniemok/fanqie-novel-reader?style=for-the-badge&color=yellow" alt="Stars">
  <img src="https://img.shields.io/github/v/release/denniemok/fanqie-novel-reader?style=for-the-badge&color=blue" alt="Release">
  <img src="https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/demo-fqnr.pages.dev-orange.svg?style=for-the-badge" alt="Demo">
</p>

---

### 🌟擺脫手機號束縛 · 告別無效廣告 · 專為「純粹閱讀」而生

這是一個為了解決海外用戶、無中國手機號、以及受夠了廣告干擾的番茄小說讀者而打造的極簡閱讀工具。

- **🔓 零門檻**：免註冊、免安裝、免中國手機號，打開即用。
- **🚫 零廣告**：徹底粉碎所有視覺噪音，還你最純粹的閱讀空間。
- **⚡ 極速下載**：高性能多線程並發預載，萬字長篇瞬間匯出 TXT。

### 👉 **立即使用**：[https://fqnr.pages.dev](https://fqnr.pages.dev)

---

**中文 | [English](README.en.md)**

<br>

## 📸 介面預覽

> [!TIP]
> **專注於細節**：針對電子書愛好者深度優化的「黑夜模式」與字體排版。

<p align="center">
  <img src="https://i.imgur.com/5tjCcuc.gif" width="97%" alt="書架">
</p>

<p align="center">
  <img src="https://i.imgur.com/g50TSk6.png" width="24%" alt="書架">
  <img src="https://i.imgur.com/SMNmPsw.png" width="24%" alt="目錄管理">
  <img src="https://i.imgur.com/emXPcRQ.png" width="24%" alt="評論">
  <img src="https://i.imgur.com/2TIg5z6.png" width="24%" alt="閱讀頁面">
</p>

<br>

## ✨ 核心功能

- **🚀 智能解析** — 全面支援 **直接貼入番茄網址**，省去手動提取書籍 ID 的麻煩。
- **🌓 護眼設計** — 自由調整字體類型、亮度與大小，長時間閱讀不疲勞。
- **📦 離線閱讀** — 強大的下載管理器，支持多章節預載與本地儲存。
- **📑 導出 TXT** — 隨時將心愛的小說導出為標準 TXT 格式。
- **💬 社群同步** — 支援查看小說實時評分與精彩評論。
- **💾 自動存檔** — 利用瀏覽器快取儲存書架與閱讀進度，即使刷新頁面也不丟失。

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

這個專案的初衷是因為我人在海外，沒有中國手機號碼卻想讀番茄小說。如果你也遇到了同樣的困擾，這個工具就是為你準備的。

**如果它解決了你的問題，請幫忙點個 ⭐ Star，這對我持續維護非常重要！**

歡迎至 [GitHub Issues](https://github.com/denniemok/fanqie-novel-reader/issues) 提出建議或回報問題。
