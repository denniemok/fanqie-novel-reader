# 番茄小說閱讀器

一個簡單、免安裝、免註冊、無廣告的番茄小說閱讀器。支援多章節下載與 TXT 匯出，無需中國大陸手機號即可在線存取。

## 功能特點

- **免安裝**：無需安裝，全在網頁運行
- **無廣告**：閱讀過程中不會顯示任何廣告
- **免註冊**：無需註冊或登入，無需中國大陸手機號
- **跨平台**：支援電腦、平板、手機，響應式設計
- **簡潔介面**：清晰的介面設計，減少干擾，專注於閱讀
- **本地儲存**：閱讀歷史與進度儲存於瀏覽器本地
- **繁簡轉換**：可切換簡體中文與繁體中文
- **閱讀設定**：可調整字體大小與文字亮度
- **下載管理**：目錄可管理章節下載，支援多章節同時預載
- **TXT 匯出**：可將已下載章節匯出為 TXT 文字檔
- **追蹤便利**：可查看評分、評論、與最新更新時間

## 快速開始

一般使用可直接透過網頁存取：<https://fqnr.pages.dev>

### 開發

```bash
npm install
npm run dev
```

在瀏覽器中開啟 `http://localhost:5173`。應用直接呼叫番茄小說 API，無需後端服務。

### 建構與部署

```bash
npm run build
```

建構後的靜態檔案輸出至 `dist/` 目錄，可部署至任意靜態託管服務（如 Vercel、Netlify、GitHub Pages、Cloudflare Pages）。

## 使用方法

1. **取得書籍 ID**：前往 [番茄小說網](https://fanqienovel.com) 找到想閱讀的小說，在詳情頁 URL 中取得數字 ID，例如：
   ```
   https://fanqienovel.com/page/123456789?...
   ```
   其中 `123456789` 即為書籍 ID。

2. **開始閱讀**：在首頁輸入框中輸入書籍 ID 或 URL，點擊「開始閱讀」。

3. **繼續閱讀**：閱讀歷史會顯示在首頁，點擊即可從上次進度繼續閱讀。

## 專案結構

```
src/
├── components/         # UI 元件（book、catalog、chapter、comments、common、home）
├── contexts/           # React Context（下載管理、Toast）
├── hooks/              # 自訂 Hooks
├── pages/              # 頁面元件
├── services/           # API 請求
└── utils/              # 工具函式
```

## 注意事項

- 本專案僅供學習交流使用，請勿將該專案應用於商業用途，否則一切風險需自行承擔。
- 本專案受 [fanqienovel-book](https://github.com/kailous/fanqienovel-book) 啟發，為其重寫版本。
- 番茄小說 API 由 [Fanqie-novel-Downloader](https://github.com/POf-L/Fanqie-novel-Downloader) 提供。

## 問題回報

如有問題或建議，可至 [GitHub Issues](https://github.com/denniemok/fanqie-novel-reader/issues) 提出。
