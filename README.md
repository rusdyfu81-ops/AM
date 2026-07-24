# Direktori Tenant Mall — Prototipe (200 kios)

Prototipe direktori toko mall dengan portal tenant dan panel rekonsiliasi okupansi.
Seluruhnya statis — tidak butuh server, tidak butuh internet setelah dimuat.

**Semua angka di dalamnya adalah ilustrasi untuk peragaan, bukan data nyata.**

## Halaman

| Berkas | Untuk siapa | Keterangan |
|---|---|---|
| `index.html` | Pengunjung | Direktori, denah, kupon. **Target QR pintu masuk.** |
| `tenant.html?kios=L3-D01` | Pemilik toko | Portal tenant. **Target QR toko.** |
| `pengelola.html` | Pemilik gedung | Rekonsiliasi selisih okupansi. |
| `setup.html` | Administrator | Nyalakan/matikan fitur, atur anggaran kupon, kelola QR dan status toko. PIN peragaan `1234`. |
| `demo.html` | Presenter | Semua tautan + QR siap cetak. |

## Publikasi ke GitHub Pages

```bash
git init
git add .
git commit -m "prototipe direktori mall"
git branch -M main
git remote add origin https://github.com/<akun>/<repo>.git
git push -u origin main
```

Lalu di GitHub: **Settings → Pages → Source: Deploy from a branch → main → / (root)**.
Situs terbit di `https://<akun>.github.io/<repo>/` dalam satu-dua menit.

Buka `demo.html`, cetak QR-nya, selesai. QR menyesuaikan alamat situs secara otomatis —
tidak ada URL yang perlu diketik manual.

## Cara memperagakan

1. **Sebelum tamu datang** — buka `setup.html` → *Kembalikan semua data ke awal*.
2. **QR pintu masuk** → peserta memindai, langsung masuk direktori. Minta mereka mencari sesuatu.
3. **QR toko** → peserta memindai, melihat portalnya, menekan *Simulasikan aktivasi*.
   Buka `demo.html` untuk melihat kios mana yang terpilih.
4. **Ketik "apotek"** di pencarian → hasilnya kosong → buka `pengelola.html`, kata itu muncul di log.
5. **Panel rekonsiliasi** — buka paling akhir, setelah bagian pemasaran selesai.

## Batasan yang perlu diketahui

- **Data tersimpan per perangkat.** Setiap HP memulai dari data awal yang sama, tetapi perubahan
  di satu HP tidak muncul di HP lain. Untuk memperagakan aliran data antarhalaman, pakai satu
  perangkat dengan beberapa tab. Sistem sungguhan membutuhkan basis data terpusat.
- **Tidak ada autentikasi.** PIN di `setup.html` hanya penghalang peragaan. Sistem sungguhan
  membutuhkan login, OTP, dan hak akses per peran.
- **Baru satu lantai.** Struktur datanya sudah siap ditambah; yang butuh waktu adalah
  pendataan lapangannya.
- **Denah memakai SVG**, bukan grid. Geometri tiap kios ada di `assets/data.js` sebagai
  `x, y, w, h` pada kanvas 1000 × 1360. Untuk denah gedung sungguhan, koordinat ini
  diganti hasil ekspor dari file CAD — bentuknya boleh tidak beraturan, tidak harus kotak.
- **Zona**: A Blok Luar Utara · B Sayap Barat · C Sayap Timur · D Blok Tengah ·
  E Kios Atrium · F Deret Selatan · G Anchor.

## Struktur

```
index.html  tenant.html  pengelola.html  setup.html  demo.html
assets/
  style.css   — seluruh tampilan
  data.js     — data contoh + konfigurasi bawaan
  app.js      — penyimpanan, denah, fungsi bersama
  qrcode.js   — pembuat QR (Kazuhiko Arase, MIT), disertakan agar tidak butuh internet
```
