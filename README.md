Compatibility Note:
Sebelum menjalankan apps, pertama-tama check terlebih dahulu node yang terinstall pada device masing masing. Karena apps ini dibuat menggunakan vite, sesuai dengan informasi yang ada di dokumentasi vite membutuhkan setidaknya node js versi 2019, 22.12+. Untuk penjelasan lebih lanjut bisa akses *https://vite.dev/guide/*

untuk saya sendiri biasanya menggunakan nvm (Node Version Manager) untuk mempermudah pergantian version node itu sendiri untuk penjelasan lebih detailnya bisa diakses melalui github link berikut *https://github.com/nvm-sh/nvm*

## 1. Bagaimana cara untuk menjalankan aplikasi?

# Hal-hal yang dibutuhkan

- pastikan telah menginstall **Node.js** (LTS sangat direkomendasikan)
- **pnpm** (`npm install -g pnpm` jika dibutuhkan)

1.  Setelah meng-clone repository jalankan perintah berikut untuk menginstall dependencies:

```bash
pnpm install
```

2. Buka dua terminal berbeda
3. Terminal pertama untuk menjalankan **mock API** (json-server) :

   ```bash
   pnpm mock-api
   ```

   Perintah di atas otomatis menjalankan `mock-api/db.json` pada port **3001** secara default.

4. Terminal kedua untuk menjalankan **Vite dev server** :

   ```bash
   pnpm dev
   ```

5. Buka applikasi pada browser di url berikut (Vite default: **http://localhost:5173**).

6. Akan muncul page login, user akan diminta untuk input email dan password bisa menggunakan list akun berikut:
   1. email: "admin@example.com",
      password: "password12",
   2. email: "george.bluth@reqres.in",
      password: "password12",

7. Terdapat fitur register jika ingin menggunakan atau membuat akun baru, meski tidak diminta namun saya sangat ingin membuatnya. User baru tidak disimpan dan akan hilang ketika merefresh halaman.

8. Setelah Login user akan bisa untuk melihat dua list menu, overview dan customer keduanya diharapkan author bisa memenuhi apa yang diharapkan dari instruksi yang diberikan.

## 2.Penjelasan singkat mengenai struktur folder (_Architecture pattern_).

Author disini menggunakan prinsip arsitektur yang bernama _buletproof architecture_, alasan author menggunakan arsitektur tersebut dibanding _clean architecture_ yang notabenenya menjadi jenis architecture popular diantaranya:

1. Sangat cocok dengan ekosistem frontend, _buletproof architecture_ membuat segala sesuatu yang memiliki keterkaitan dalam satu area (_feature based_)
2. Mengurangi masalah _spaghetti imports_
3. _buletproof architecture_ sangat cocok digunakan untuk kebutuhan seperti pengerjaan assessment ini dikarenakan assessment seperti ini tidak membutuhkan bisnis logic yang kompleks

adapun sruktur project yang ada pada apps ini sebagai berikut

```
src/
├── app/                      # Application shell
│   ├── index.tsx             # Root app composition
│   ├── provider.tsx          # QueryClient, error boundary, notifications, auth bootstrap
│   ├── router.tsx            # createBrowserRouter, lazy routes
│   └── routes/               # Thin route pages (auth, app layout, 404)
│
├── assets/                   # Static imports (auth hero images, dashboard avatar)
│
├── components/               # Shared, non-feature UI
│   ├── errors/
│   ├── layouts/              # AuthLayout, DashboardLayout, sidebar config, hero pane
│   ├── seo/
│   └── ui/                   # Button, form primitives, table, notifications, spinner
│
├── config/                   # env (Zod), route paths helpers
│
├── features/                 # Feature modules (each with a consistent shape)
│   ├── auth/
│   │   ├── api/              # React Query hooks, Zod schemas (get-auth, auth-store)
│   │   ├── components/       # Login/register forms, AuthLoader, ProtectedRoute
│   │   ├── services/         # Mock auth: login, register, session read/clear
│   │   ├── types/
│   │   └── utils/            # e.g. editorial form class strings
│   ├── customers/
│   │   ├── api/              # useCustomers, useCustomerOverviewStats, query types
│   │   ├── components/       # Customers list, KPI cards, table cells
│   │   ├── services/         # HTTP + json-server query building, overview aggregation
│   │   ├── types/
│   │   └── utils/            # Table formatters, metric card builders, list config
│   └── overview/
│       ├── api/              # useOverviewStats (same cache key as customer overview)
│       ├── components/       # ISP overview dashboard, subscriber row
│       ├── services/         # Thin wrapper over customer overview fetch
│       ├── types/            # OverviewStats alias
│       └── utils/            # IDR/join-date formatters, package display map
│
├── lib/                      # Cross-cutting helpers
│   ├── api-client.ts         # fetch wrapper, auth header, 401 handling
│   ├── auth.tsx              # Re-exports auth feature (optional compatibility barrel)
│   └── react-query.ts        # Query client defaults
│
├── types/                    # Global API types (User, paginated responses, etc.)
├── utils/                    # e.g. cn() for Tailwind class merging
├── main.tsx
└── index.css

mock-api/
└── db.json                   # json-server data source (customers)
```

---

3. Keputusan teknis (_Technical decisions_) – mengapa kandidat menstrukturkan komponen atau _state_ dengan cara tersebut.

### modules fitur

- **Mengapa dibuat seperti itu?:** Menjaga agar modul customer, auth, dan overview tetap terisolasi (memiliki concern masing-masing). Setiap fitur memiliki `api/`, `services/`, `types/`, `components/`, dan `utils/` yang menjadikannya masuk akal karena setiap files memiliki scope yang lebih kecil and imports memiliki arah yang jelas (UI → hooks → service → HTTP).

### Server state: TanStack Query

- **Mengapa menggunakan TanStack Query (React Query):** List customer dan statistik overview berasal dari remote (server), dapat di-cache, dan mendapatkan manfaat dari pengelolaan loading/error state, deduplikasi, mencegah adanya race condition, serta penggunaan query key yang konsisten. Hook overview menggunakan query key yang sama dengan modul customer, sehingga satu kali request ke network sudah cukup untuk memenuhi kedua entry point saat keduanya aktif (mounted).

### Auth: service + hooks + minimal Zustand

- **Mengapa memilih kombinasi itu?**: Proses login/register dan pemulihan sesi (session restore) di-enkapsulasi dalam features/auth/services/authService.ts (menggunakan mock delay, penyimpanan user di localStorage, dan token). File get-auth.ts berisi schema Zod serta integrasi useMutation / useQuery. Zustand hanya digunakan untuk menyimpan token auth yang sinkron dengan localStorage; sementara profil user disimpan di cache Query (["auth","user"]) agar UI tetap konsisten setelah login tanpa perlu menduplikasi “current user” di banyak store.

### Forms: React Hook Form + Zod

- **Kenapa penting?:** Validasi bertipe (typed validation), lebih sedikit re-render dibanding pola uncontrolled hal ini juga setara dengan intstruksi yang ada agar menjaga atau mencegah dari terjadinya re-render, serta penggunaan komponen bersama seperti Form / Input di components/ui/form.

### Routing and code splitting

- **Apakah hal itu perlu?:** Penggunaan createBrowserRouter dengan modul route yang di-lazy load membuat ukuran bundle awal lebih kecil. ProtectedRoute dan AuthLoader ditempatkan di dalam feature auth agar konfigurasi router tetap deklaratif. Sesuai dengan apa yang diminta pada instruksi untuk mendeklarasikan beberapa route yang _protected_ sehingga ketika user mencoba mengakses dan tanpa memiliki session user akan selalu dikembalikan ke page login.
