# MedAdmin — Real API bilan Integratsiya Qilingan Tibbiyot Admin Paneli

Ushbu admin paneli to'liq **TypeScript (TSX)**, **TanStack React Query**, **Axios**, **React Hook Form** va **Zod** orqali haqiqiy Render backend API bilan ishlaydi.

---

## 🌐 Real Backend API

- **Base URL**: `https://med-clinic-back.onrender.com`
- **Swagger Docs**: `https://med-clinic-back.onrender.com/api/docs`
- **Auth**: JWT Bearer token avtomatik ravishda `apiClient` Axios interceptorida yuboriladi.

### Integratsiya Qilingan Endpointlar:
1. 🏥 **Klinika Sozlamalari (`/clinic`)**:
   - `GET /clinic` — Klinika rekvizitlari, statistikasi, manzili va ish vaqti.
   - `PATCH /clinic` — Ma'lumotlarni tahrirlash va yangilash.
2. 🩺 **Mutaxassisliklar (`/specialties`)**:
   - `GET /specialties` — Barcha yo'nalishlar.
   - `POST /specialties` — Yangi mutaxassislik qo'shish (name, description, icon).
   - `PATCH /specialties/:id` — Tahrirlash.
   - `DELETE /specialties/:id` — O'chirish.
3. 👨‍⚕️ **Shifokorlar (`/doctors`)**:
   - `GET /doctors` — Qidiruv va mutaxassislik bo'yicha filtrlash.
   - `POST /doctors` — Yangi shifokor yaratish (Zod formasi bilan).
   - `PATCH /doctors/:id` — Shifokor ma'lumotlarini tahrirlash.
   - `DELETE /doctors/:id` — Bazadan o'chirish.
4. 💉 **Xizmatlar va Preyskurant (`/services`)**:
   - `GET /services` — Xizmatlar ro'yxati va narxlar.
   - `POST /services` — Yangi xizmat qo'shish (narxi, davomiyligi, mutaxassislik).
   - `PATCH /services/:id` — Xizmatni tahrirlash.
   - `DELETE /services/:id` — Xizmatni o'chirish.
5. 📝 **Qabullar Taqvimi (`/appointments`)**:
   - `GET /appointments` — Statuslar bo'yicha filter (`pending`, `confirmed`, `completed`, `cancelled`).
   - `POST /appointments` — Yangi qabul yozish.
   - `PATCH /appointments/:id` — Statusni o'zgartirish.
   - `DELETE /appointments/:id` — Qabulni o'chirish.
6. ✉️ **Kelib tushgan Murojaatlar (`/contact`)**:
   - `GET /contact` — Onlayn so'rovlar ro'yxati.
   - `DELETE /contact/:id` — Murojaatni o'chirish.
7. 🔐 **Autentifikatsiya (`/auth/login`)**:
   - `POST /auth/login` — Real JWT autentifikatsiya.
   - Login uchun default ma'lumot: **`admin`** / **`adminpassword123`**.

---

## 📁 To'liq TypeScript Fayllar Strukturasi

```
src/
├── api/
│   ├── client.ts              # Axios instance (Bearer token interceptor)
│   ├── queryClient.ts         # TanStack QueryClient sozlamalari
│   ├── clinic.api.ts          # Klinika API so'rovlari
│   ├── specialties.api.ts     # Mutaxassisliklar API so'rovlari
│   ├── doctors.api.ts         # Shifokorlar API so'rovlari
│   ├── services.api.ts        # Xizmatlar API so'rovlari
│   ├── appointments.api.ts    # Qabullar API so'rovlari
│   ├── contact.api.ts         # Murojaatlar API so'rovlari
│   └── auth.api.ts            # Kirish / Ro'yxatdan o'tish
├── types/
│   ├── clinic.types.ts        # ClinicInfo, UpdateClinicDto
│   ├── specialty.types.ts     # Specialty, CreateSpecialtyDto
│   ├── doctor.types.ts        # Doctor, CreateDoctorDto, Schedule
│   ├── service.types.ts       # MedicalService, CreateServiceDto
│   ├── appointment.types.ts   # Appointment, Status
│   ├── contact.types.ts       # ContactMessage
│   └── auth.types.ts          # AuthUser, LoginResponse
├── context/
│   ├── AuthContext.tsx        # JWT Auth state (login/logout/token)
│   └── ToastContext.tsx       # Toast xabarnomalar (Success, Error, Info)
├── components/
│   ├── common/                # Type-safe universal UI komponentlar
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Loader.tsx
│   │   └── EmptyState.tsx
│   └── layout/
│       ├── AdminLayout.tsx
│       ├── Sidebar.tsx        # Real dinamik badge hisoblagichlari bilan
│       └── Header.tsx         # Real murojaatlar va klinika nomi bilan
├── pages/
│   ├── auth/Login.tsx
│   ├── dashboard/Dashboard.tsx
│   ├── doctors/DoctorsList.tsx & DoctorModal.tsx
│   ├── specialties/SpecialtiesList.tsx & SpecialtyModal.tsx
│   ├── services/ServicesList.tsx & ServiceModal.tsx
│   ├── appointments/AppointmentsList.tsx & AppointmentCreateModal.tsx
│   ├── contact/ContactList.tsx
│   ├── settings/Settings.tsx
│   └── not-found/NotFound.tsx
├── routes/
│   ├── AppRoutes.tsx
│   └── ProtectedRoute.tsx
├── utils/
│   ├── cn.ts
│   └── format.ts              # Valyuta (UZS) va sana formatlagichlari
├── App.tsx
├── main.tsx
└── index.css
```

---

## 🛠 Ishga tushirish

```bash
# Kutubxonalarni o'rnatish
npm install

# TypeScript tekshiruvi va build
npm run build

# Lokal serverni ishga tushirish (http://localhost:3000)
npm run dev
```

---

> **Eslatma:** Hech qanday mock yoki soxta ma'lumotlar qolmadi. Barcha ma'lumotlar bevosita `https://med-clinic-back.onrender.com` serveridan yuklanadi, yaratiladi, yangilanadi va o'chiriladi.
