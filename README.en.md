# Fanqie Novel Reader (FQNR)

<p align="left">
  <img src="https://img.shields.io/github/stars/denniemok/fanqie-novel-reader?style=for-the-badge&color=yellow" alt="Stars">
  <img src="https://img.shields.io/github/v/release/denniemok/fanqie-novel-reader?style=for-the-badge&color=blue" alt="Release">
  <img src="https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/demo-fqnr.pages.dev-orange.svg?style=for-the-badge" alt="Demo">
</p>

---

### 🌟 Ad-Free · Pure Reading Experience

A minimalist web-based reader designed for Fanqie Novel (番茄小說) lovers who live overseas, don't have a Chinese phone number, or are simply tired of intrusive ads.

- **🔓 Zero Barriers**: No registration, no installation, and no Chinese phone number required. Just open and read.
- **🚫 Ad-Free**: Say goodbye to all visual noise. Enjoy a clean and focused reading environment.
- **⚡ High-Speed Download**: Built-in multi-threaded downloader for batch chapter preloading and TXT export.

### 👉 **Live Demo**: [https://fqnr.pages.dev](https://fqnr.pages.dev)

> [!NOTE]
> This site does not have MTL yet. Use Google Translate or AI translation plugins in your browser as an alternative. **We plan to add MTL in the future — stay tuned!**

---

**[中文](README.md) | English**

<br>

## 📸 Preview

> [!TIP]
> Deeply optimized "Dark Mode" and typography for book lovers.

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

## ✨ Features

- **🚀 Smart Parsing** — Directly paste a **Fanqie URL**; no need to manually extract the Book ID.
- **🌓 Eye-Care Design** — Fully customizable fonts, brightness, and themes for long-duration reading.
- **📦 Offline Reading** — Robust download manager supporting chapter preloading and local storage.
- **📑 Export to TXT** — Export your favorite novels into standard TXT format with one click.
- **💬 Community Sync** — Access real-time ratings and trending comments from the community.
- **💾 Auto-Save** — Your reading progress and shelf are automatically saved via browser cache.

<br>

## 🧩 Quick Start

Start reading in just three simple steps:
1. **Copy URL**: Find a book on [Fanqie Novel](https://fanqienovel.com) and copy the URL from your browser.
2. **Paste & Go**: Paste the URL into the search bar and click "Start Reading".
3. **Enjoy**: The system automatically parses the Book ID and loads the content. History is saved automatically.

> [!TIP]
> You can also enter the Book ID directly (e.g., `7234567890`) for even faster access.

<br>

## 🚢 Deployment

Built with **Vite + React**. Pure frontend implementation with no backend required. It can be deployed to any static hosting platform.

```bash
# Local Development
npm install
npm run dev # Open http://localhost:5173

# Build for Production (Files located in dist/)
npm run build
```

- **Deployment**: Highly recommended for Vercel, Netlify, GitHub Pages, or Cloudflare Pages.
- **Technical Note**: The app calls Fanqie Novel APIs directly.

> [!NOTE]
> **Acknowledgements**:
> - Inspired by [fanqienovel-book](https://github.com/kailous/fanqienovel-book).
> - API provided by [Fanqie-novel-Downloader](https://github.com/POf-L/Fanqie-novel-Downloader).

<br>

## 📁 Structure

```
src/
├── components/         # UI parts (book, catalog, chapter, etc.)
├── contexts/           # State management (downloads, toasts)
├── hooks/              # Custom React hooks
├── pages/              # Main pages
├── services/           # API calls
└── utils/              # Helper functions
```

<br>

## ⚠️ Disclaimer

- This project is for personal use only.
- Users must comply with local laws and the terms of service of the source website.
- All content copyrights belong to the original authors and Fanqie Novel.

<br>

## 📋 License

This project is licensed under the [MIT License](LICENSE). You may use the source code with attribution and include the license notice.

<br>

## 💡 Developer's Note
This project started because I live overseas and couldn't read Fanqie novels without a Chinese phone number. If you share the same frustration, this tool is for you.

**If this project helps you, please give it a ⭐ Star. It means a lot to me!**

Feel free to report bugs or suggest features via [GitHub Issues](https://github.com/denniemok/fanqie-novel-reader/issues).
