<div align="center">

# 🎓 CBT Pro

### Sistem Ujian Online Berbasis Web

[![Build & Release APK](https://github.com/username/Build-APK-Native-via-Kotlin/actions/workflows/build.yml/badge.svg)](https://github.com/username/Build-APK-Native-via-Kotlin/actions)
[![Firebase](https://img.shields.io/badge/Firebase-9.22.2-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Android%20%7C%20iOS-blue?style=flat&logo=google-chrome&logoColor=white)](https://cbt-sekolah-568d8.firebaseapp.com)
[![Made with](https://img.shields.io/badge/Made%20with-HTML%20%7C%20CSS%20%7C%20JS-orange?style=flat&logo=javascript&logoColor=white)](https://developer.mozilla.org/)
[![Single File](https://img.shields.io/badge/App-Single%20File%20PWA-blueviolet?style=flat)](index.html)
[![Dark Mode](https://img.shields.io/badge/Theme-Dark%20%2F%20Light-111111?style=flat&logo=half-life&logoColor=white)](#)

<br/>

**CBT Pro** adalah aplikasi Computer-Based Test (CBT) berbasis web yang ringan, cepat, dan dapat diinstall sebagai PWA di semua perangkat. Dibangun dalam satu file `index.html` tanpa framework berat — cocok untuk sekolah, lembaga kursus, dan lingkungan dengan koneksi terbatas.

[🚀 Demo Live](https://cbt-sekolah-568d8.firebaseapp.com) · [🐛 Laporkan Bug](issues) · [💡 Request Fitur](issues)

</div>

---

## ✨ Fitur Unggulan

### 👨‍🏫 Untuk Guru / Admin
- **Buat & kelola ujian** — tambah soal manual atau impor via file **CSV**
- **Generate kode ujian unik** + **QR Code** otomatis untuk akses cepat siswa
- **Live monitoring sesi** — pantau siswa yang sedang mengerjakan secara real-time
- **Export hasil** ke PDF langsung dari browser
- **Multi sesi** — jalankan beberapa ujian sekaligus

### 👨‍🎓 Untuk Siswa
- **Masuk ujian** via kode manual atau **scan QR Code** langsung dari kamera
- **Navigasi soal** dengan sidebar interaktif
- **Anti-kecurangan** — deteksi pindah tab / keluar layar (focus guard)
- **Overlay suspended** jika terdeteksi pelanggaran
- **Hasil & review jawaban** otomatis setelah submit

### 🌐 Teknologi & Infrastruktur
| Fitur | Detail |
|---|---|
| **Auth** | Firebase Authentication |
| **Database** | Firebase Firestore (realtime) |
| **Cache lokal** | localStorage (session cache) |
| **QR Scan** | jsQR 1.4.0 via CDN |
| **QR Generate** | QRCode.js |
| **Font** | Space Mono, DM Sans, DM Serif Display |
| **PWA** | Web App Manifest + installable |
| **Tema** | Dark Mode & Light Mode (tanpa FOUC) |
| **Responsive** | Mobile-first, support semua ukuran layar |

---

## 📱 Screenshot

> _Tambahkan screenshot aplikasi di sini_

| Login | Dashboard Guru | Ujian Siswa |
|:---:|:---:|:---:|
| ![login](#) | ![dashboard](#) | ![exam](#) |

---

## 🚀 Cara Penggunaan

### Sebagai Guru
1. Buka aplikasi → pilih **Guru**
2. Login dengan akun yang sudah terdaftar
3. Buat ujian baru di tab **Soal** — tambah manual atau upload CSV
4. Buat sesi ujian → bagikan **kode** atau **QR Code** ke siswa
5. Monitor progres siswa secara live di tab **Sesi**

### Sebagai Siswa
1. Buka aplikasi → pilih **Siswa**
2. Masukkan kode ujian atau scan QR Code
3. Kerjakan soal, navigasi lewat sidebar
4. Submit → lihat hasil & review jawaban

---

## 📂 Format CSV Import Soal

```csv
pertanyaan,opsi_a,opsi_b,opsi_c,opsi_d,jawaban
"Ibu kota Indonesia adalah?","Jakarta","Bandung","Surabaya","Medan","A"
"2 + 2 = ?","3","4","5","6","B"
```

---

## 🔧 Setup & Deployment

### Prasyarat
- Akun [Firebase](https://firebase.google.com) (gratis)
- Browser modern (Chrome, Firefox, Safari, Edge)

### Deploy Manual
1. Clone repo ini
2. Isi konfigurasi Firebase di bagian `firebaseConfig` dalam `index.html`
3. Upload `index.html` ke Firebase Hosting / Netlify / Vercel / GitHub Pages

### Deploy via GitHub Actions (CI/CD)

Repo ini dilengkapi workflow otomatis untuk build & release APK:

```yaml
# Trigger otomatis saat push ke main atau tag v*.*.*
on:
  push:
    branches: [ main ]
    tags:
      - 'v*.*.*'
```

**GitHub Secrets yang diperlukan:**

| Secret | Keterangan |
|---|---|
| `GOOGLE_SERVICES_JSON` | Base64 dari `google-services.json` Firebase |
| `KEYSTORE_BASE64` | Base64 dari file `.jks` keystore (untuk release) |
| `KEYSTORE_PASSWORD` | Password keystore |
| `KEY_ALIAS` | Alias key |
| `KEY_PASSWORD` | Password key |

**Cara encode google-services.json:**
```bash
base64 google-services.json | tr -d '\n'
```

---

## 🏗️ Struktur Proyek

```
├── index.html          # Seluruh aplikasi (single-file PWA)
├── gradle.properties   # Konfigurasi AndroidX
├── gradlew             # Gradle wrapper script
├── app/
│   ├── build.gradle    # Build config Android
│   └── google-services.json  # Firebase config (jangan di-commit!)
└── .github/
    └── workflows/
        └── build.yml   # CI/CD GitHub Actions
```

---

## 🔒 Keamanan

- `google-services.json` **tidak boleh** di-commit ke repo publik
- Gunakan **GitHub Secrets** untuk semua kredensial sensitif
- Firebase Security Rules direkomendasikan untuk membatasi akses data

---

## 🤝 Kontribusi

Pull request sangat disambut! Untuk perubahan besar, buka issue terlebih dahulu.

1. Fork repo ini
2. Buat branch baru (`git checkout -b fitur/nama-fitur`)
3. Commit perubahan (`git commit -m 'feat: tambah fitur X'`)
4. Push ke branch (`git push origin fitur/nama-fitur`)
5. Buka Pull Request

---

## 📄 Lisensi

Didistribusikan di bawah lisensi **MIT**. Lihat [`LICENSE`](LICENSE) untuk informasi lebih lanjut.

---

<div align="center">

Dibuat dengan ❤️ untuk kemudahan ujian digital di Indonesia

[![Firebase](https://img.shields.io/badge/Powered%20by-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![PWA](https://img.shields.io/badge/Installable-PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

</div>
