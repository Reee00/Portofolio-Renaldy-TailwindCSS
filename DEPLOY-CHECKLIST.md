# Deploy Checklist Portfolio

Gunakan checklist ini sebelum publish/update portofolio.

## 1) Jalankan Lokal
- Jalankan: `python3 -m http.server 8080`
- Buka: `http://localhost:8080/index.html`

## 2) Cek Link Internal
- Home, About, Gallery, Profile, Contact dapat diklik.
- Halaman `Hasil Latihan` dan `sublatihan.html?id=...` terbuka normal.

## 3) Validasi Broken Link Latihan
Jalankan:

```bash
node - <<'NODE'
const fs = require('fs');
const path = require('path');
const txt = fs.readFileSync('latihan-data.js','utf8');
const links = [...txt.matchAll(/link:\s*"([^"]+)"/g)].map(m=>m[1]);
const missing = links.filter((link) => !fs.existsSync(path.resolve(process.cwd(), link)));
console.log('total links:', links.length);
console.log('missing:', missing.length);
if (missing.length) missing.forEach((m) => console.log('-', m));
NODE
```

Target: `missing: 0`

## 4) Validasi JavaScript
Jalankan:

```bash
node --check js/mainn.js
```

## 5) Test Contact Form
- Buka `contact.html`
- Kirim form dengan data valid
- Pastikan muncul status berhasil / gagal
- Cek inbox email tujuan FormSubmit

## 6) Test Gallery + Case Study
- Filter category berfungsi
- Lightbox bisa buka/tutup
- Link studi kasus mengarah ke:
  - `project-ykai-website.html`
  - `project-profile-redesign.html`
  - `project-portal-ykai.html`

## 7) Mobile Quick Check
- Cek pada lebar layar kecil (DevTools)
- Pastikan navbar, tombol, dan teks tetap terbaca

## 8) Final Content Check
- Tidak ada teks placeholder seperti "ganti nanti"
- Judul dan deskripsi project jelas
- Kontak dan tautan sosial valid
