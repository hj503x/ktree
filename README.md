# Ktree

A family-tree builder: add people with photos, link parents/partners/children
(including past partners), and the app lays out generations and draws the
connecting lines automatically. Includes zoom/pan, light/dark theme,
GEDCOM import, and JSON export/import for backup.

## Run it locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Put it on GitHub

```bash
cd ktree-app
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/ktree.git
git push -u origin main
```

## Deploy for free on GitHub Pages

This repo already includes `.github/workflows/deploy.yml`, which builds and
publishes the site automatically on every push to `main`.

1. Push the code (steps above).
2. On GitHub, go to **Settings → Pages** and set **Source** to
   **GitHub Actions**.
3. Push again (or re-run the workflow from the **Actions** tab) — it will
   build and deploy.
4. Your site will be live at `https://<your-username>.github.io/ktree/`.

### Alternative: Vercel or Netlify

Both auto-detect Vite. Import the GitHub repo on either platform, leave the
default build command (`npm run build`) and output directory (`dist`), and
deploy — no extra config needed.

## Features

- **Add people** with name, birth/death year, and a photo (resized and
  stored as a small embedded image).
- **Relationships**: up to two parents, and any number of partners over
  time, each marked Together / Divorced / Widowed (shown as a solid or
  dashed connector line).
- **Auto layout**: generations are computed from the relationships and
  drawn as rows, with roman-numeral generation markers.
- **Zoom & pan**: zoom controls plus click-and-drag panning for larger
  trees.
- **Light/dark theme** toggle, saved to the browser.
- **GEDCOM import**: bring in a tree exported from Ancestry, MyHeritage,
  FamilySearch, etc. (`.ged` files). The parser reads names, birth/death
  years, couples, and children — GEDCOM extras like sources, notes, or
  media aren't imported.
- **Export / Import JSON**: back up your tree to a file, or move it to
  another browser or device by importing that file there.
- **Print / Save as PDF**: uses the browser's native print dialog with a
  print-friendly layout (choose "Save as PDF" as the destination).

## About syncing across devices

This version stores data in the browser's `localStorage`, so it's
per-browser only — it won't automatically appear on your phone or another
computer. For now, use **Export** on one device and **Import JSON** on
another to move a tree over.

For real multi-device or multi-person syncing, the next step is a small
backend — [Supabase](https://supabase.com) (Postgres + auth, generous free
tier) or [Firebase](https://firebase.google.com/) are both good fits and
integrate cleanly with a Vite/React app. That wiring needs your own
project credentials, so it isn't included here, but the data model
(`people` array of `{id, name, birthYear, deathYear, photo, parents,
partners}`) maps directly onto a single database table if you want to add
it.
