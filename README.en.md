# Fanqie Novel Reader

[繁體中文](README.md) | English

A simple, ad-free Fanqie novel reader. No installation or registration needed. Supports multi-chapter downloads and TXT export without a Chinese phone number.

For foreign readers, use Google Translate or AI translation plugins in your browser to translate this site.

## Preview

<p align="center">
  <img src="https://i.imgur.com/OwM0o2um.png" width="24%" alt="預覽 1">
  <img src="https://i.imgur.com/iUC48s8m.png" width="24%" alt="預覽 2">
  <img src="https://i.imgur.com/JjPwI30m.png" width="24%" alt="預覽 3">
  <img src="https://i.imgur.com/gam1lGpm.png" width="24%" alt="預覽 4">
</p>

## Features

- **Ad-Free**: No ads, just reading.
- **No Install**: Runs entirely in your browser.
- **No Login**: No sign-up or Chinese phone number required.
- **Responsive**: Works great on desktop, tablet, and mobile.
- **Clean UI**: Simple design to help you focus on the story.
- **Local Storage**: Your history and progress stay in your browser.
- **Customizable**: Adjust font size, type, and brightness.
- **Batch Download**: Preload chapters and manage them in the catalog.
- **TXT Export**: Save your downloaded chapters as TXT files.
- **Stay Updated**: See ratings, comments, and the latest updates.

## Quick Start

Try it here: <https://fqnr.pages.dev>

### Development

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`. The app calls the Fanqie API directly — no backend needed.

### Deployment

```bash
npm run build
```

Static files are in `dist/`. Deploy them to Vercel, Netlify, GitHub Pages, or Cloudflare Pages.

## Usage

1. **Get Book ID**: Go to [Fanqie Novel](https://fanqienovel.com). Find a book. Copy the numeric ID from the URL:
   ```
   https://fanqienovel.com/page/123456789?...
   ```
   The Book ID is `123456789`.

2. **Start Reading**: Paste the Book ID or URL in the homepage textbox and click "Start Reading".

3. **Pick Up Where You Left Off**: Your history is on the homepage. Click a book and continue from the previous checkpoint.

## Structure

```
src/
├── components/         # UI parts (book, catalog, chapter, etc.)
├── contexts/           # State management (downloads, toasts)
├── hooks/              # Custom React hooks
├── pages/              # Main pages
├── services/           # API calls
└── utils/              # Helper functions
```

## Notes

- This project is for personal use and learning only. Please don't use it commercially.
- Inspired by [fanqienovel-book](https://github.com/kailous/fanqienovel-book).
- API provided by [Fanqie-novel-Downloader](https://github.com/POf-L/Fanqie-novel-Downloader).

## Feedback

Have a question or suggestion? Open an issue on [GitHub](https://github.com/denniemok/fanqie-novel-reader/issues).
