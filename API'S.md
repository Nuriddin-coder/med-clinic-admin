Yangilangan to'liq API endpointlar ro'yxati:
1. 🏥 Clinic (/v1/clinic)
GET /v1/clinic — Klinika haqidagi ma'lumotlarni olish
PATCH /v1/clinic — Klinika ma'lumotlarini qisman tahrirlash (masalan: telefon raqamlar, ish vaqti, bemorlar soni)
PUT /v1/clinic — Klinika ma'lumotlarini to'liq yangilash
2. 🩺 Specialties (/v1/specialties)
GET /v1/specialties — Barcha mutaxassisliklar ro'yxati
GET /v1/specialties/:id — Bitta mutaxassislikni olish
POST /v1/specialties — Yangi mutaxassislik qo'shish (name, description, icon)
PATCH /v1/specialties/:id — Mutaxassislikni tahrirlash
PUT /v1/specialties/:id — Mutaxassislikni to'liq yangilash
DELETE /v1/specialties/:id — Mutaxassislikni o'chirish
3. 👨‍⚕️ Doctors (/v1/doctors)
GET /v1/doctors — Shifokorlar ro'yxati (qidiruv, mutaxassislik bo'yicha filter va saralash bilan)
GET /v1/doctors/:id — Bitta shifokor profili (ish jadvali va sharhlari bilan)
POST /v1/doctors — Yangi shifokor yaratish (fullName, specialtyIds, title, experienceYears, consultationPrice, bio, gender, education, languages, schedule)
PATCH /v1/doctors/:id — Shifokor ma'lumotlarini tahrirlash (narx, unvon, bio, ish jadvali va h.k.)
PUT /v1/doctors/:id — Shifokorni to'liq yangilash
DELETE /v1/doctors/:id — Shifokorni o'chirish
4. 💉 Services (/v1/services)
GET /v1/services — Xizmatlar ro'yxati (qidiruv va saralash bilan)
GET /v1/services/:id — Bitta xizmat ma'lumoti
POST /v1/services — Yangi xizmat qo'shish (name, description, specialtyId, durationMinutes, price)
PATCH /v1/services/:id — Xizmatni tahrirlash (narxini o'zgartirish, davomiyligini yangilash)
PUT /v1/services/:id — Xizmatni to'liq yangilash
DELETE /v1/services/:id — Xizmatni o'chirish
5. 📅 Slots (/v1/slots)
GET /v1/slots — Shifokor va xizmat bo'yicha bo'sh vaqt slotlarini hisoblash
6. 📝 Appointments (/v1/appointments)
GET /v1/appointments — Qabullar ro'yxati (telefon, shifokor, sana yoki status bo'yicha filtrlar bilan)
GET /v1/appointments/:id — Bitta qabul ma'lumotlarini ko'rish
POST /v1/appointments — Yangi qabulga yozilish
PATCH /v1/appointments/:id — Admin/Shifokor tomonidan qabul statusini o'zgartirish (confirmed, completed, cancelled, no_show)
PATCH /v1/appointments/:id/cancel — Bemor tomonidan qabulni bekor qilish (telefon raqam tekshiruvi bilan)
DELETE /v1/appointments/:id — Qabulni bazadan o'chirish
7. ✉️ Contact (/v1/contact)
GET /v1/contact — Barcha kelib tushgan murojaatlar ro'yxatini ko'rish (admin)
GET /v1/contact/:id — Bitta murojaatni ko'rish
POST /v1/contact — Yangi murojaat yuborish
DELETE /v1/contact/:id — Murojaatni o'chirish