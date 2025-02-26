# Service Report Generator

## 📦 Instalasi

### 1. Clone Repository
```sh
git clone <repository-url>
cd service-report
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Konfigurasi Environment
Copy file `.env.example` ubah menjadi `.env` dan isi dengan konfigurasi
```sh
NEXT_PUBLIC_API_URL=
DATABASE_URL="mysql://username:password@localhost:3306/service_report"
```

## 🚀 Menjalankan Aplikasi

### Mode Pengembangan
```sh
npm run dev
```
Aplikasi akan berjalan di `http://localhost:3000`

### Build & Production
```sh
npm run build
npm start
```
Aplikasi akan berjalan di `http://localhost:3000`

## 🔄 Migrasi Database

```sh
npx drizzle-kit push
```

## 📚 Library 

### Frontend
- **Next.js**
- **Chakra UI**
- **TanStack React Query**
- **Zustand**
- **React Hook Form**
- **React Signature Canvas**
- **React Icons**
- **Moment.js**

### Backend
- **Hono.js**
- **Drizzle ORM**
- **MySQL2**
- **Axios**
- **Lodash**
- **Dotenv**
- **PDF-lib**

## 📖 Dokumentasi API
Dokumentasi API:
```
http://localhost:3000/api/docs
```

---