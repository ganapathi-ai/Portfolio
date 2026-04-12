# 🚀 Deploy to Vercel for Free

## Files in this project
```
portfolio/
├── index.html
├── style.css
├── main.js
├── vercel.json
└── DEPLOY.md
```

---

## Step 1 — Push to GitHub

1. Go to [github.com](https://github.com) → **New repository**
2. Name it `portfolio` → **Create repository**
3. Open terminal in your project folder and run:

```bash
git init
git add .
git commit -m "Initial portfolio commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

> Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 2 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and click **Sign Up**
2. Sign up using your **GitHub account** (free)
3. Click **Add New → Project**
4. Find and select your `portfolio` repository
5. Leave all settings as default — Vercel auto-detects static sites
6. Click **Deploy**

✅ Done! Your site will be live at:
```
https://portfolio-YOUR_USERNAME.vercel.app
```

---

## Step 3 — Custom Domain (Optional, Free)

1. In your Vercel project → **Settings → Domains**
2. Add a custom domain you own, or use the free `.vercel.app` subdomain

---

## Auto-Deploy on Every Push

Every time you push changes to GitHub, Vercel automatically redeploys your site. No manual steps needed.

```bash
git add .
git commit -m "Update portfolio"
git push
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Blank page | Check browser console for errors |
| Fonts not loading | Ensure internet connection (Google Fonts CDN) |
| Build failed | Check `vercel.json` is valid JSON |

---

## Local Preview (Before Deploying)

Just open `index.html` directly in your browser — no server needed since this is a pure static site.
