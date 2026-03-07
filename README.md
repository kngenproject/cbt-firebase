# CBT Pro — Sistem Ujian Online

Aplikasi Computer-Based Test (CBT) berbasis web dengan Firebase Firestore, Firebase Authentication, dan Firebase Hosting. Deploy otomatis via GitHub Actions.

---

## 🗂 Struktur Project

```
cbt-project/
├── index.html                        # Aplikasi utama
├── firebase.json                     # Konfigurasi Firebase Hosting & Firestore
├── firestore.rules                   # Security rules Firestore
├── firestore.indexes.json            # Index query Firestore
├── .firebaserc                       # Project ID Firebase
├── .gitignore
├── README.md
└── .github/
    └── workflows/
        └── firebase-deploy.yml       # Auto-deploy ke Hosting via GitHub Actions
```

---

## ⚙️ Setup Awal (lakukan sekali)

### 1. Isi Firebase Config di `index.html`

Buka `index.html`, cari bagian `firebaseConfig` (sekitar baris 1645) dan ganti nilainya:

```js
const firebaseConfig = {
  apiKey:            "...",   // Firebase Console → Project Settings → Your apps
  authDomain:        "....firebaseapp.com",
  projectId:         "...",
  storageBucket:     "....appspot.com",
  messagingSenderId: "...",
  appId:             "..."
};
```

### 2. Isi Project ID di `.firebaserc`

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

### 3. Buat Akun Guru di Firebase Console

Masuk ke **Firebase Console → Authentication → Users → Add user**

Isi email dan password guru. Akun ini digunakan untuk login ke dashboard.

### 4. Tambahkan GitHub Secrets

Masuk ke **GitHub repo → Settings → Secrets and variables → Actions → New repository secret**

Tambahkan dua secret berikut:

| Secret Name | Nilai |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | JSON service account (lihat langkah di bawah) |
| `FIREBASE_PROJECT_ID` | Project ID Firebase kamu |

**Cara dapat Service Account JSON:**
1. Firebase Console → Project Settings → Service accounts
2. Klik **Generate new private key** → Download file JSON
3. Salin **seluruh isi** file JSON → paste sebagai nilai secret `FIREBASE_SERVICE_ACCOUNT`

---

## 🚀 Deploy

### Auto-deploy (via GitHub Actions)

Setiap kali **push ke branch `main`** → otomatis deploy ke production.

Setiap kali buat **Pull Request** → Firebase buat **preview URL** unik untuk review.

### Manual deploy (via CLI)

```bash
# Install Firebase CLI (sekali saja)
npm install -g firebase-tools

# Login
firebase login

# Deploy semua (hosting + firestore rules + indexes)
firebase deploy

# Deploy hanya hosting
firebase deploy --only hosting

# Deploy hanya rules
firebase deploy --only firestore:rules
```

---

## 🔥 Struktur Firestore

```
firestore/
├── exams/
│   └── {kodeUjian}/          # Satu dokumen per ujian
│       ├── code: "ABC123"
│       ├── title: "Ujian Matematika"
│       ├── mapel: "Matematika"
│       ├── dur: 60
│       ├── status: "aktif" | "selesai"
│       ├── questions: [...]
│       └── createdAt: Timestamp
│
├── results/
│   └── {kode}_{nis}_{ts}/    # Satu dokumen per hasil ujian
│       ├── name: "Budi"
│       ├── nis: "2024-001"
│       ├── examCode: "ABC123"
│       ├── score: 85
│       ├── correct: 17
│       ├── wrong: 2
│       ├── skip: 1
│       ├── violations: 0
│       └── date: "..."
│
└── config/
    └── uploadedSoal/          # Bank soal upload guru
        └── soal: [...]
```

---

## 🛡 Security Rules

| Collection | Read | Write |
|---|---|---|
| `exams` | Semua (siswa perlu baca) | Guru saja (authenticated) |
| `results` | Guru saja | Semua (siswa submit) |
| `config` | Guru saja | Guru saja |

---

## 🔄 Alur Aplikasi

```
Guru login (Firebase Auth)
  └─→ Dashboard realtime (Firestore onSnapshot)
        ├─→ Buat ujian → simpan ke exams/
        ├─→ Upload soal → simpan ke config/uploadedSoal
        ├─→ Monitor sesi aktif (live)
        └─→ Lihat hasil siswa (live)

Siswa (tanpa login)
  └─→ Masukkan nama, NIS, kode ujian
        └─→ Ambil data dari exams/{kode}
              └─→ Kerjakan ujian
                    └─→ Submit → simpan ke results/
```

---

## ❓ Troubleshooting

**Error `Missing or insufficient permissions`**
→ Deploy firestore rules: `firebase deploy --only firestore:rules`

**Error index Firestore di browser console**
→ Firebase akan tampilkan link untuk buat index otomatis. Klik linknya.

**GitHub Actions gagal**
→ Pastikan secret `FIREBASE_SERVICE_ACCOUNT` dan `FIREBASE_PROJECT_ID` sudah diisi dengan benar.

**Siswa bisa join ujian yang sudah ditutup**
→ Pastikan status ujian di Firestore sudah `selesai` (bukan hanya di memori lokal).
