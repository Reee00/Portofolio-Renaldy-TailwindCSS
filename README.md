# Ahmad Renaldy Portfolio

Portfolio website dengan fokus recruiter-first presentation:

- Menonjolkan 3 studi kasus utama.
- Menyajikan alur problem -> action -> impact.
- Memisahkan learning archive dari jalur utama recruiter.

## Tech Stack

- HTML
- Tailwind CSS (compiled local build)
- Custom CSS (`css/styless.css`)
- Vanilla JavaScript (`js/mainn.js`)

## Project Highlights

- Landing page recruiter-focused di `index.html`.
- Case studies:
  - `project-ykai-website.html`
  - `project-profile-redesign.html`
  - `project-portal-ykai.html`
- Learning archive tersedia terpisah di `Latihan.html`.

## Local Development

1. Install dependencies.

```bash
npm install
```

1. Build Tailwind CSS.

```bash
npm run build:css
```

1. Run local server.

```bash
python3 -m http.server 8081
```

1. Open in browser.

```text
http://localhost:8081/index.html
```

## Useful Scripts

- Build CSS once.

```bash
npm run build:css
```

- Watch CSS changes.

```bash
npm run watch:css
```

## Quality Checks

- Check JS syntax.

```bash
node --check js/mainn.js
```

- Validate latihan links.

```bash
node - <<'NODE'
const fs = require('fs');
const path = require('path');
const txt = fs.readFileSync('latihan-data.js', 'utf8');
const links = [...txt.matchAll(/link:\s*"([^"]+)"/g)].map((m) => m[1]);
const missing = links.filter(
  (link) => !fs.existsSync(path.resolve(process.cwd(), link))
);
console.log('total links:', links.length);
console.log('missing:', missing.length);
if (missing.length) missing.forEach((link) => console.log('-', link));
NODE
```

## Folder Structure (Main)

```text
index.html
about.html
gallery.html
profile.html
contact.html
project-*.html
Latihan.html
sublatihan.html
css/
js/
images/
```

## Deployment Notes

- Build CSS terlebih dulu (`npm run build:css`).
- Deploy sebagai static site (Netlify, Vercel, GitHub Pages, atau server biasa).
- Pastikan semua halaman root dapat diakses:
  - `index.html`
  - `gallery.html`
  - `contact.html`
  - tiga `project-*.html`
