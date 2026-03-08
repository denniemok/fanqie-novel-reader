# 番茄小說閱讀器

繁體中文 | [English](README.en.md)

一個簡單、無廣告的番茄小說閱讀器。免安裝、免註冊，支援多章節下載與 TXT 匯出，無需中國手機號即可在線閱讀。

## 預覽

<p align="center">
  <img src="https://i.imgur.com/OwM0o2um.png" width="24%" alt="預覽 1">
  <img src="https://i.imgur.com/iUC48s8m.png" width="24%" alt="預覽 2">
  <img src="https://i.imgur.com/JjPwI30m.png" width="24%" alt="預覽 3">
  <img src="https://i.imgur.com/gam1lGpm.png" width="24%" alt="預覽 4">
</p>

## 功能特點

- **無廣告**：純粹閱讀，沒有廣告干擾。
- **免安裝**：直接在瀏覽器運行，無需安裝。
- **免註冊**：無需登入，也不需要中國手機號。
- **跨平台**：支援電腦、平板與手機，響應式設計。
- **簡潔介面**：介面乾淨，讓你專注於閱讀。
- **本地儲存**：閱讀歷史與進度自動儲存於瀏覽器。
- **個人化設定**：可自由調整字體、大小與亮度。
- **下載管理**：支援多章節預載，方便離線閱讀。
- **TXT 匯出**：可將已下載章節匯出為 TXT 檔。
- **追蹤更新**：輕鬆查看評分、評論與最新更新。

## 快速開始

線上使用：<https://fqnr.pages.dev>

### 開發

```bash
npm install
npm run dev
```

開啟 `http://localhost:5173` 即可。應用直接呼叫番茄小說 API，無需後端。

### 部署

```bash
npm run build
```

靜態檔案位於 `dist/`，可部署至 Vercel、Netlify、GitHub Pages 或 Cloudflare Pages。

## 使用方法

1. **取得書籍**：前往 [番茄小說網](https://fanqienovel.com) 找到小說，從網址複製數字 ID：
   ```
   https://fanqienovel.com/page/123456789?...
   ```
   書籍 ID 即為 `123456789`。

2. **開始閱讀**：在首頁輸入框中輸入 ID 或網址，點擊「開始閱讀」。

3. **繼續閱讀**：首頁會顯示閱讀歷史，點擊即可接續進度。

## 專案結構

```
src/
├── components/         # UI 元件 (book, catalog, chapter, etc.)
├── contexts/           # 狀態管理 (下載, Toast)
├── hooks/              # 自訂 Hooks
├── pages/              # 頁面元件
├── services/           # API 請求
└── utils/              # 工具函式
```

## 注意事項

- 本專案僅供學習交流，請勿用於商業用途。
- 受 [fanqienovel-book](https://github.com/kailous/fanqienovel-book) 啟發重寫。
- API 由 [Fanqie-novel-Downloader](https://github.com/POf-L/Fanqie-novel-Downloader) 提供。

## 問題回報

如有建議或問題，歡迎至 [GitHub Issues](https://github.com/denniemok/fanqie-novel-reader/issues) 提出。
