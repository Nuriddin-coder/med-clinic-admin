import React from 'react';
import {
  Users,
  CalendarCheck,
  Stethoscope,
  TrendingUp,
  Clock,
  ArrowUpRight,
  UserPlus,
  PlusCircle,
  Phone,
  Sparkles,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardBody } from '@/components/common/Card';
import { Badge, BadgeVariant } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { DashboardSkeleton } from '@/components/common/Skeletons';
import { Link } from 'react-router-dom';
import { getClinicInfo } from '@/api/clinic.api';
import { getDoctors } from '@/api/doctors.api';
import { getAppointments } from '@/api/appointments.api';
import { getServices } from '@/api/services.api';
import { getContacts } from '@/api/contact.api';
import { getSpecialties } from '@/api/specialties.api';
import { formatCurrency, formatDate, formatUzbekPhone } from '@/utils/format';

const statusMap: Record<string, { label: string; variant: BadgeVariant }> = {
  pending: { label: 'Kutilmoqda', variant: 'warning' },
  confirmed: { label: 'Tasdiqlangan', variant: 'info' },
  completed: { label: 'Tugallandi', variant: 'success' },
  cancelled: { label: 'Bekor qilingan', variant: 'danger' },
  no_show: { label: 'Kelmadi', variant: 'neutral' },
};

export const Dashboard: React.FC = () => {
  const { data: clinic, isLoading: clinicLoading } = useQuery({
    queryKey: ['clinic'],
    queryFn: getClinicInfo,
  });

  const { data: doctorsData, isLoading: docsLoading } = useQuery({
    queryKey: ['doctors', 'dashboard'],
    queryFn: () => getDoctors({ limit: 4, sort: 'rating-desc' }),
  });

  const { data: appointmentsData, isLoading: appLoading } = useQuery({
    queryKey: ['appointments', 'dashboard'],
    queryFn: () => getAppointments({ limit: 5, sort: 'date-desc' }),
  });

  const { data: confirmedAppointmentsData } = useQuery({
    queryKey: ['appointments', 'confirmed-count'],
    queryFn: () => getAppointments({ status: 'confirmed', limit: 1 }),
  });

  const { data: servicesData } = useQuery({
    queryKey: ['services', 'count'],
    queryFn: () => getServices({ limit: 1 }),
  });

  const { data: contactsData } = useQuery({
    queryKey: ['contacts', 'count'],
    queryFn: () => getContacts({ limit: 1 }),
  });

  const { data: specialtiesData } = useQuery({
    queryKey: ['specialties', 'count'],
    queryFn: () => getSpecialties({ limit: 1 }),
  });

  const doctors = doctorsData?.data ?? [];
  const totalDoctors = doctorsData?.total ?? 0;
  const appointments = appointmentsData?.data ?? [];
  const totalAppointments = appointmentsData?.total ?? 0;
  const totalConfirmed = confirmedAppointmentsData?.total ?? 0;
  const totalServices = servicesData?.total ?? 0;
  const totalContacts = contactsData?.total ?? 0;
  const totalSpecialties = specialtiesData?.total ?? 0;

  const isLoading = clinicLoading || docsLoading || appLoading;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const statCards = [
    {
      title: 'Faol Shifokorlar',
      value: `${totalDoctors} nafar`,
      sub: `${totalSpecialties} ta mutaxassislik`,
      icon: Stethoscope,
      color: 'emerald',
      link: '/admin/doctors',
    },
    {
      title: 'Barcha Qabullar',
      value: `${totalAppointments} ta`,
      sub: `${totalConfirmed} tasdiqlangan`,
      icon: CalendarCheck,
      color: 'sky',
      link: '/admin/appointments',
    },
    {
      title: 'Tibbiy Xizmatlar',
      value: `${totalServices} turdagi`,
      sub: 'Diagnostika va ko\'riklar',
      icon: TrendingUp,
      color: 'indigo',
      link: '/admin/services',
    },
    {
      title: 'Murojaatlar & Xabarlar',
      value: `${totalContacts} ta`,
      sub: 'Mijozlar so\'rovlari',
      icon: Mail,
      color: 'teal',
      link: '/admin/contacts',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {clinic?.name || 'MED Clinic'} — Boshqaruv Markazi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {clinic?.tagline || 'Onlayn yozilish va navbatsiz qabul tizimi'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/doctors">
            <Button
              variant="outline"
              size="md"
              className="shrink-0 inline-flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Shifokor qo'shish</span>
            </Button>
          </Link>
          <Link to="/admin/appointments">
            <Button
              size="md"
              className="shrink-0 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Yangi qabul</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Real Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link key={i} to={stat.link}>
              <Card className="hover:border-slate-300 hover:shadow-md transition-all cursor-pointer">
                <CardBody className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {stat.title}
                    </span>
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                    <span className="text-xs font-medium text-slate-500">{stat.sub}</span>
                  </div>
                </CardBody>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Main Grid: Real Appointments & On-Duty Doctors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real Appointments Table (2 cols) */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Qabullar Ro'yxati"
              subtitle="Haqiqiy backenddan olingan so'nggi yozuvlar"
              action={
                <Link
                  to="/admin/appointments"
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Barchasini ko'rish ({totalAppointments}) →
                </Link>
              }
            />
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3.5">Qabul Sanasi</th>
                    <th className="px-5 py-3.5">Bemor</th>
                    <th className="px-5 py-3.5">Aloqa</th>
                    <th className="px-5 py-3.5">Vaqti</th>
                    <th className="px-5 py-3.5">Holat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-slate-400 text-xs">
                        Hozircha hech qanday qabul mavjud emas.
                      </td>
                    </tr>
                  ) : (
                    appointments.slice(0, 5).map((app) => {
                      const st = statusMap[app.status] || {
                        label: app.status,
                        variant: 'neutral' as BadgeVariant,
                      };
                      return (
                        <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-5 py-4">
                            <span className="text-sm font-semibold text-slate-800 block">
                              {formatDate(app.date)}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-semibold text-slate-800">
                            {app.patientName}
                          </td>
                          <td className="px-5 py-4 text-xs text-slate-600 font-mono">
                            {formatUzbekPhone(app.patientPhone)}
                          </td>
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-1 text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded-md font-medium">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {app.time}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <Badge variant={st.variant}>{st.label}</Badge>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right side: Real Doctors List preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Shifokorlar"
              subtitle={`Jami ${totalDoctors} nafar mutaxassis`}
              action={
                <Link to="/admin/doctors" className="text-xs font-semibold text-emerald-600 hover:underline">
                  Barchasi →
                </Link>
              }
            />
            <CardBody className="p-4 space-y-3">
              {doctors.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs">
                    {doc.photoInitials || doc.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-xs truncate">{doc.fullName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{doc.title}</p>
                    <p className="text-[10px] text-emerald-600 font-medium">
                      {formatCurrency(doc.consultationPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Clinic Summary Card */}
          <div className="rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 p-5 text-white shadow-lg shadow-emerald-900/10">
            <div className="flex items-center gap-2 text-emerald-100 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Klinika Ma'lumoti</span>
            </div>
            <h4 className="text-base font-bold mt-2">{clinic?.name}</h4>
            <p className="text-xs text-emerald-100/90 mt-1 line-clamp-2">
              {clinic?.about}
            </p>
            <div className="mt-4 pt-3 border-t border-emerald-500/40 flex items-center justify-between text-xs">
              <span className="font-mono">{formatUzbekPhone(clinic?.phones?.[0]) || '+998 71 200 08 08'}</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-[11px]">{clinic?.years} yillik tajriba</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

