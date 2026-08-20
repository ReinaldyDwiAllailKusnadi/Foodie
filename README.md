# 🍲 Foodie - Aplikasi Resep Makanan Mobile (React Native + Expo)

**Foodie** adalah aplikasi mobile resep makanan modern dan responsif yang dibangun menggunakan **React Native** dan **Expo**. Aplikasi ini dirancang untuk memudahkan pengguna menemukan aneka resep lezat berdasarkan kategori, menyimpan resep favorit, serta membuat, mengedit, dan mengelola kreasi resep sendiri secara lokal menggunakan **AsyncStorage**.

Aplikasi ini 100% kompatibel dan siap dijalankan melalui **Expo Go**, **Expo CLI Lokal**, maupun diimpor langsung ke **Snack Expo**.

---

## 🌟 Fitur Utama

1. **Eksplorasi & Filter Resep**:
   - Menampilkan lebih dari 15 contoh resep lezat dan realistis lengkap dengan foto beresolusi tinggi.
   - Filter resep berdasarkan **10+ Kategori** (All, Breakfast, Lunch, Dinner, Dessert, Snack, Indonesian, Italian, Japanese, Healthy, Drinks) menggunakan FlatList horizontal.
   - Fitur pencarian resep instan berdasarkan judul resep, kategori, maupun bahan makanan.

2. **Detail Resep Lengkap & Interaktif**:
   - Hero image berukuran besar dengan gradient overlay.
   - Informasi detail: Waktu persiapan, jumlah porsi, jumlah kalori, dan tingkat kesulitan (*Mudah*, *Sedang*, *Sulit*).
   - Daftar bahan-bahan yang dilengkapi checklist interaktif.
   - Langkah instruksi memasak berurutan dengan penomoran jelas.
   - Tombol toggle Favorit langsung pada halaman detail.

3. **Sistem Resep Favorit**:
   - Simpan dan hapus resep favorit secara instan hanya dengan menekan ikon hati.
   - Data favorit disimpan secara persisten di `AsyncStorage` (`@foodie_favorites`).
   - Tab khusus "Favorit" dengan *Empty State* interaktif jika belum ada favorit.

4. **Kelola "Makanan Saya" (CRUD Penuh)**:
   - **Create**: Form tambah resep baru dengan dukungan `expo-image-picker`, daftar bahan dinamis (+ Tambah / Hapus Bahan), instruksi dinamis (+ Tambah / Hapus Langkah), dan validasi lengkap.
   - **Read**: Menampilkan seluruh resep buatan pengguna di tab "Makanan Saya".
   - **Update**: Form Edit resep dengan auto-prefill data lama untuk memperbarui nama, gambar, bahan, dan instruksi.
   - **Delete**: Hapus resep dengan dialog konfirmasi (`Alert.alert`) sebelum data dihapus dari `AsyncStorage` (`@foodie_my_recipes`).

5. **Navigasi Mulus & Responsif**:
   - Kombinasi **Bottom Tab Navigator** (Home, Favorit, Makanan Saya) dan **Native Stack Navigator** (Detail Resep, Tambah Resep, Edit Resep).
   - Tombol navigasi kembali (*Back button*) tersedia di seluruh sub-halaman.

---

## 🛠️ Teknologi yang Digunakan

- **Framework**: React Native (~0.76), Expo (~52.0)
- **Bahasa**: JavaScript (ES6+ / React Functional Components & Hooks)
- **Navigasi**:
  - `@react-navigation/native`
  - `@react-navigation/native-stack`
  - `@react-navigation/bottom-tabs`
- **Penyimpanan Lokal**: `@react-native-async-storage/async-storage`
- **Media & Gambar**: `expo-image-picker`
- **Ikon**: `@expo/vector-icons` (Ionicons & MaterialCommunityIcons)
- **Safe Area Management**: `react-native-safe-area-context` & `react-native-screens`

---

## 📁 Struktur Folder Proyek

```
Foodie/
├── assets/                     # Aset ikon dan splash screen
├── src/
│   ├── components/             # Komponen UI Reusable
│   │   ├── CategoryItem.js     # Tombol pill kategori
│   │   ├── CategoryList.js     # Horizontal FlatList kategori
│   │   ├── CustomHeader.js     # Header dengan navigasi back
│   │   ├── EmptyState.js       # Tampilan kosong interaktif
│   │   ├── FavoriteButton.js   # Tombol toggle hati favorit
│   │   └── RecipeCard.js       # Kartu resep dengan badges & actions
│   │
│   ├── data/                   # Data statis awal
│   │   ├── categories.js       # 10+ kategori resep
│   │   └── recipes.js          # 16 resep realistis & foto Unsplash
│   │
│   ├── navigation/             # Konfigurasi routing
│   │   └── AppNavigator.js     # Bottom Tabs + Stack Navigator
│   │
│   ├── screens/                # Layar aplikasi
│   │   ├── HomeScreen.js         # Beranda, pencarian, & filter
│   │   ├── RecipeDetailScreen.js # Detail lengkap resep
│   │   ├── FavoritesScreen.js    # Daftar resep favorit
│   │   ├── MyRecipesScreen.js    # Daftar resep buatan pengguna
│   │   ├── AddRecipeScreen.js    # Form tambah resep baru
│   │   └── EditRecipeScreen.js   # Form edit resep
│   │
│   ├── storage/                # Modul persistence AsyncStorage
│   │   └── storage.js          # Helper CRUD resep & favorit
│   │
│   └── styles/                 # Desain sistem & tema
│       └── theme.js            # Skema warna, typography, spacing, shadows
│
├── App.js                      # Root component
├── app.json                    # Konfigurasi Expo
├── package.json                # Dependencies & script
└── README.md                   # Dokumentasi
```

---

## 🚀 Panduan Instalasi & Menjalankan Aplikasi

### 1. Prasyarat
- Pastikan telah menginstal **Node.js** (versi 18 ke atas disarankan).
- Pastikan aplikasi **Expo Go** terinstal di smartphone fisik Anda (Android / iOS) atau gunakan Emulator.

### 2. Langkah Instalasi
Buka terminal dan arahkan ke direktori proyek `Foodie`:

```bash
cd Foodie
npm install
```

Atau jika menginstal dependensi manual via npx/expo:
```bash
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage expo-image-picker @expo/vector-icons
```

### 3. Menjalankan Aplikasi
Jalankan perintah berikut:
```bash
npx expo start
```
- Scan QR Code yang muncul di terminal menggunakan aplikasi **Expo Go** pada smartphone Android Anda, atau aplikasi Kamera di iOS.
- Tekan `a` untuk membuka di Android Emulator atau `w` untuk menjalankan di web browser.

---

## 🌐 Menjalankan di Snack Expo (snack.expo.dev)

Proyek ini telah dirancang khusus agar dapat langsung diimpor ke **Snack Expo**:
1. Buat Snack baru di [snack.expo.dev](https://snack.expo.dev).
2. Unggah/salin folder `src/` dan file `App.js` ke panel editor Snack.
3. Di panel `package.json` Snack, pastikan dependensi berikut terdaftar:
   - `@react-navigation/native`
   - `@react-navigation/native-stack`
   - `@react-navigation/bottom-tabs`
   - `react-native-screens`
   - `react-native-safe-area-context`
   - `@react-native-async-storage/async-storage`
   - `expo-image-picker`
   - `@expo/vector-icons`
4. Seluruh gambar bawaan menggunakan URL Unsplash publik sehingga akan langsung tampil tanpa kendala path lokal!

---

## 📋 Checklist Pemenuhan Kriteria Tugas

| No | Kriteria Tugas | Status |
|:---|:---|:---:|
| 1 | Project dapat dijalankan melalui Expo dan Snack Expo | ✅ Terpenuhi |
| 2 | Home memiliki minimal 10 kategori resep secara horizontal | ✅ Terpenuhi (11 item) |
| 3 | Halaman Detail menampilkan nama, gambar, bahan, instruksi, waktu, porsi, kalori, kesulitan | ✅ Terpenuhi |
| 4 | Filter resep berubah sesuai kategori yang dipilih + opsi "All" | ✅ Terpenuhi |
| 5 | Ikon hati/favorite dapat di-toggle (favorit / batal favorit) | ✅ Terpenuhi |
| 6 | Halaman Favorit menampilkan seluruh resep yang difavoritkan | ✅ Terpenuhi |
| 7 | Terdapat menu "Makanan Saya" dan opsi "Tambahkan Resep Baru" | ✅ Terpenuhi |
| 8 | Form Tambah Resep memiliki nama, pilih gambar, bahan dinamis, instruksi dinamis, & simpan | ✅ Terpenuhi |
| 9 | Resep baru tersimpan di AsyncStorage & muncul di "Makanan Saya" | ✅ Terpenuhi |
| 10 | Resep di "Makanan Saya" menampilkan detail lengkap saat dibuka | ✅ Terpenuhi |
| 11 | Tombol Edit & Hapus (dengan konfirmasi dialog) berfungsi nyata | ✅ Terpenuhi |
| 12 | Seluruh halaman memiliki tombol back/navigasi kembali yang berfungsi | ✅ Terpenuhi |

---

## 👤 Author
**Foodie Development Team**
Dibuat dengan ❤️ menggunakan React Native & Expo.
