# Refactor Plan — `ReservationList.jsx`

> Dokumen perencanaan refactor halaman antrian kunjungan.
> Disusun berdasarkan review kode, diskusi, dan keputusan yang sudah disepakati.

## 1. Konteks

`src/reservations/ReservationList.jsx` (534 baris) adalah halaman daftar antrian
kunjungan. Saat ini seluruh tanggung jawab ditumpuk dalam satu komponen:
data fetching, state & filter, event handler / bisnis logic, dan HTML/UI.

Penulis memiliki latar belakang **fullstack MVC (CodeIgniter/Laravel)** dan ingin
struktur React yang lebih terbagi agar mudah dibaca, diuji, dan dirawat.

## 2. Hasil Review Kode

### Bug fungsional
1. **`listService(token, {paging: 100})` salah param** — fungsi membaca
   `{page, perPage}` (ServiceTypes.js:3), bukan `paging`. Hanya 10 layanan yang ter-fetch.
2. **`queueList` mengabaikan semua filter** — Query.js:35 fetch ke `/queues/all`
   tanpa query string (kode asli dikomentari). Tanggal/status/search/page/jenis
   layanan tidak pernah terkirim → filter & pagination mati.
3. **Mismatch nama field** — render pakai `queue.queue_id` (key, baris 450),
   tapi `handleCheckIn`/`handleAbsent` pakai `item.id`, sedangkan
   `handlePrimaryAction` pakai `item.queue_id`. Salah satu pasti tidak match →
   optimistic update gagal.
4. **State navigate salah field** — `handlePrimaryAction` (baris 268-274) mengirim
   `patientName`, `gender`, `age`, `visitDate`, `referenceCode` yang tidak ada di
   struktur queue (`nama_pasien`, `jenis_kelamin`, `usia`, `tanggal_kunjungan`).
5. **Effect mount menimpa localStorage** — baris 281-283 men-reset
   `tanggalKunjungan` ke hari ini, kontradiktif dengan tujuan `useLocalStorage`.

### Anti-pattern React
6. **`useEffectEvent` dipakai untuk data fetching** — bukan tujuan hook tersebut.
   Menyimpang dari panduan resmi React.
7. **Race condition** — tanpa `AbortController`, respon bisa out-of-order.
8. **Tidak ada loading/error state** untuk list antrian (hanya `console.log`).
9. **Optimistic update ditimpa server** — `setQueues(nextQueues)` mengganti seluruh
   list, inkonsisten dengan update lokal.
10. **Search tanpa debounce** — refetch setiap keystroke.
11. **5 state filter terpisah** — rawan bug & re-render; lebih baik satu object.
12. **Pagination setengah jadi** — `currentPage` ada tapi tidak ada UI prev/next.
13. **Sisa debugging** — `console.log("clicked")` dsb. di `handlePrimaryAction`.
14. **Minor** — `getTodayDate()` tiap render; object `variants` dibuat ulang;
    double-toast di `handleQrScan`; tombol reset jarang aktif; `ActionButton`
    duplikat dengan `Patients.jsx`.

### Yang sudah bagus
- `useMemo` untuk `activeServiceOptions`.
- Normalisasi payload (`normalizeQueueList`, `normalizeServiceOptions`).
- Penggunaan `useLocalStorage` untuk tanggal (kecuali bug #5).
- Pola `useAssessmentPatient` (CustomHooks.js) sudah preseden hook yang rapi.

## 3. Pemetaan Mentality MVC → React

| MVC | React | Target file |
|---|---|---|
| Model | API layer + normalisasi | `lib/api/Queue.js`, `lib/utils/Normalization.js` |
| Controller | Custom hooks (state + side-effect + aksi) | `lib/hooks/useQueueList.js`, `useServiceOptions.js` |
| View | Presentational components (JSX + props saja) | `QueueFilterBar.jsx`, `QueueTable.jsx` |
| Route handler | Container komponen tipis | `ReservationList.jsx` |

### Alur data
```
ReservationList (container) — pegang STATE lewat hooks
   ├─ useQueueList()        → { queues, isLoading, error, filters, checkIn, markAbsent, reset }
   ├─ useServiceOptions()   → { options, loading, toggle, clear }
   └─ useAuth() / navigate
        │  kirim state + callback sebagai PROPS
QueueFilterBar (view)        QueueTable (view)
   panggil onXxx(...)          panggil onCheckIn(id) dst.
        │  peristiwa naik sebagai callback
   hook meng-update state → React re-render view
```
Prinsip: **data mengalir ke bawah, peristiwa naik ke atas, logika di hook**.

## 4. Penilaian Best Practice React

### Sudah sesuai ✅
- Custom hooks untuk reusable logic (rekomendasi resmi React).
- Menghapus `useEffectEvent` untuk fetching (anti-pattern).
- Menghapus effect yang mengubah state (anti-pattern "adjusting state during render").
- AbortController, debounce, loading/error state, single responsibility.

### Catatan / area yang butuh kejujuran ⚠️
1. **Container/presentational bukan kewajiban** — jangan over-split;
   `QueueFilterBar` + `QueueTable` sudah cukup. (Alternatif valid: tiap komponen
   konsumsi hook langsung tanpa container pembawa props.)
2. **TanStack Query = gold standard server state** (cache, dedup, retry,
   refetch-on-focus, auto loading/error, mutation + invalidation). Custom hooks
   dipilih karena tanpa dependency baru & familiar, tetapi berarti menulis ulang
   yang library itu selesaikan. Cocok dipertimbangkan jika project berkembang.
3. **Normalisasi defensif menandakan API tidak konsisten** — idealnya kontrak API
   stabil; normalisasi hanya lapisan tipis.
4. **State filter idealnya di URL** (`useSearchParams`) agar bisa di-share/back.

## 5. Keputusan yang Disepakati

| Pertanyaan | Keputusan |
|---|---|
| Data fetching | **Custom hooks saja** (tanpa dependency baru) |
| `queueList` tanpa params | **Perbaiki: kirim query params** ke `/queues/all` |
| Pagination | **Hilangkan** — tampilkan semua (perPage besar, tanpa currentPage) |
| Scope | **ReservationList saja dulu** (pilot), pola diterapkan ke halaman lain nanti |

TanStack Query dibahas sebagai opsi arsitektur; keputusan akhir tetap custom hooks,
dengan catatan untuk dievaluasi ulang di masa depan.

## 6. Rencana Implementasi

### 6.1 Perbaikan API layer
**`src/lib/api/Queue.js`**
- `queueList`: pasang `params.toString()` pada URL `/queues/all` (params sudah
  dibangun di baris 13-26) agar tanggal/status/search/jenis layanan terkirim.

### 6.2 Normalisasi data
**`src/lib/utils/Normalization.js`**
- Pindahkan `normalizeQueueList` dari komponen.
- Normalisasi per-item: kanonikalisasi `queue_id`/`id` (disamakan) sehingga
  optimistic update & PATCH selalu konsisten.

### 6.3 Controller hooks (baru)
**`src/lib/hooks/useQueueList.js`**
- State: `queues`, `selectedDate` (useLocalStorage, default hari ini jika kosong),
  `status`, `searchTerm`, `selectedServiceIds`, `isLoading`, `error`, `isUpdating`.
- Fetch dengan **AbortController** + **loading/error**.
- Aksi: `checkIn`, `markAbsent`, `markCalled` (optimistic + PATCH + rekonstruksi
  dari response server), `resetFilters`.
- **Tanpa pagination** (perPage 100, tanpa currentPage).
- Search memakai `useDebounce` dari `react-use`.

**`src/lib/hooks/useServiceOptions.js`**
- Fetch services dengan fix `{perPage: 100}`.
- Expose: `options`, `loading`, `toggle`, `clear`, label terpilih.

### 6.4 View components (baru, presentasional)
- **`src/components/ActionButton.jsx`** — ekstrak tombol bersama.
- **`src/reservations/QueueFilterBar.jsx`** — form filter (tanggal, status,
  search, dropdown layanan, reset, tombol scan).
- **`src/reservations/QueueTable.jsx`** — tabel + legend + loading/error/empty
  state + tombol aksi (disabled saat `isUpdating`).

### 6.5 Container tipis
**`src/reservations/ReservationList.jsx`**
- Kompose `useQueueList` + `useServiceOptions` + `useAuth` + `navigate`.
- Tangani `handleQrScan` dan `handlePrimaryAction` (navigate memakai field nyata:
  `nama_pasien`, `jenis_kelamin`, `usia`, `tanggal_kunjungan`, `nomor_antrian`).
- Render `QueueFilterBar`, `QueueTable`, `QrScanner`.
- Buang `console.log`, double-toast QR, effect penimpa localStorage,
  `useEffectEvent`.

### 6.6 Verifikasi
- `npm run lint`
- `npm run build`

## 7. Flow (mengikuti AGENTS.md)

- **Phase 1**: fetch latest remote → buat branch baru (mis. `refactor/reservation-list`)
  → tampilkan ringkasan → tunggu approval. (WIP branch `fix/renew-menubar`
  tidak tersentuh.)
- **Phase 2**: implementasi → lint/build → ringkasan → tunggu testing user.
- **Phase 3**: buat PR → ringkasan PR.
