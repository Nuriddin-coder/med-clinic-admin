import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Search,
  Filter,
  X,
  ArrowUpDown,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} from '@/api/appointments.api';
import { getAllDoctors } from '@/api/doctors.api';
import { getAllServices } from '@/api/services.api';
import {
  Appointment,
  AppointmentStatus,
  AppointmentSortOption,
} from '@/types/appointment.types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShadcnSelect } from '@/components/ui/select';
import { Badge, BadgeVariant } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { AppointmentsTableSkeleton } from '@/components/common/Skeletons';
import { AppointmentCreateModal } from './AppointmentCreateModal';
import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal';
import { formatDate } from '@/utils/format';
import { useToast } from '@/context/ToastContext';
import { useDebounce } from '@/hooks/useDebounce';

const statusTabs = [
  { key: 'ALL', label: 'Barchasi' },
  { key: 'pending', label: 'Kutilmoqda' },
  { key: 'confirmed', label: 'Tasdiqlangan' },
  { key: 'completed', label: 'Tugallandi' },
  { key: 'cancelled', label: 'Bekor qilindi' },
  { key: 'no_show', label: 'Kelmadi' },
];

const sortOptions = [
  { value: 'date-desc', label: 'Qabul sanasi (Yangi)' },
  { value: 'date-asc', label: 'Qabul sanasi (Eski)' },
  { value: 'createdAt-desc', label: 'Yozilgan vaqti (Yangi)' },
  { value: 'createdAt-asc', label: 'Yozilgan vaqti (Eski)' },
  { value: 'patientName-asc', label: 'Bemor ismi (A - Z)' },
  { value: 'patientName-desc', label: 'Bemor ismi (Z - A)' },
];

export const AppointmentsList: React.FC = () => {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [doctorId, setDoctorId] = useState<string>('ALL');
  const [serviceId, setServiceId] = useState<string>('ALL');
  const [date, setDate] = useState<string>('');
  const [sort, setSort] = useState<AppointmentSortOption>('date-desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const debouncedSearch = useDebounce(search, 400);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);

  // Fetch all doctors and services for filters, display mapping, and modal
  const { data: doctors = [] } = useQuery({
    queryKey: ['doctors', 'all'],
    queryFn: getAllDoctors,
  });

  const { data: services = [] } = useQuery({
    queryKey: ['services', 'all'],
    queryFn: getAllServices,
  });

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: [
      'appointments',
      {
        search: debouncedSearch,
        status: statusFilter,
        doctorId,
        serviceId,
        date,
        sort,
        page,
        limit,
      },
    ],
    queryFn: () =>
      getAppointments({
        search: debouncedSearch.trim() || undefined,
        status: statusFilter !== 'ALL' ? (statusFilter as AppointmentStatus) : undefined,
        doctorId: doctorId !== 'ALL' ? doctorId : undefined,
        serviceId: serviceId !== 'ALL' ? serviceId : undefined,
        date: date || undefined,
        sort,
        page,
        limit,
      }),
  });

  const appointments = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const doctorMap = useMemo(() => {
    const map = new Map<string, string>();
    doctors.forEach((d) => map.set(d.id, d.fullName));
    return map;
  }, [doctors]);

  const serviceMap = useMemo(() => {
    const map = new Map<string, string>();
    services.forEach((s) => map.set(s.id, s.name));
    return map;
  }, [services]);

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      updateAppointmentStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      success("Qabul holati muvaffaqiyatli o'zgartirildi");
    },
    onError: (err: Error) => {
      toastError("Holatni o'zgartirishda xatolik", err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      success("Qabul muvaffaqiyatli o'chirildi");
      setAppointmentToDelete(null);
    },
    onError: (err: Error) => {
      toastError("O'chirishda xatolik", err.message);
    },
  });

  const handleDelete = (app: Appointment) => {
    setAppointmentToDelete(app);
  };

  const confirmDelete = () => {
    if (appointmentToDelete) {
      deleteMutation.mutate(appointmentToDelete.id);
    }
  };

  const handleStatusChange = (app: Appointment, newStatus: AppointmentStatus) => {
    statusMutation.mutate({ id: app.id, status: newStatus });
  };

  const doctorSelectOptions = [
    { value: 'ALL', label: `Barcha shifokorlar (${doctors.length})` },
    ...doctors.map((d) => ({ value: d.id, label: d.fullName })),
  ];

  const serviceSelectOptions = [
    { value: 'ALL', label: `Barcha xizmatlar (${services.length})` },
    ...services.map((s) => ({ value: s.id, label: s.name })),
  ];

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setDoctorId('ALL');
    setServiceId('ALL');
    setDate('');
    setSort('date-desc');
    setPage(1);
  };

  const hasActiveFilters =
    search ||
    statusFilter !== 'ALL' ||
    doctorId !== 'ALL' ||
    serviceId !== 'ALL' ||
    date ||
    sort !== 'date-desc';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Qabullar Jadvali</h1>
          <p className="text-sm text-slate-500 mt-1">
            Bemorlarning shifokorlar qabuliga yozilishlari va holatini boshqarish
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="shrink-0 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">Yangi qabul yozish</span>
        </Button>
      </div>

      {/* Filter Tabs & Toolbar */}
      <div className="space-y-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Status Tabs */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 border-b border-slate-100">
          <div className="flex items-center gap-1.5 shrink-0">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setStatusFilter(tab.key);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  statusFilter === tab.key
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 text-xs text-slate-500 hover:text-rose-600 gap-1 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              Filtrlarni tozalash
            </Button>
          )}
        </div>

        {/* Search & Select Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1">
          {/* Search */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Bemor, telefon, izoh..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* Doctor Filter */}
          <div>
            <ShadcnSelect
              value={doctorId}
              onValueChange={(val) => {
                setDoctorId(val);
                setPage(1);
              }}
              options={doctorSelectOptions}
              placeholder="Shifokor"
            />
          </div>

          {/* Service Filter */}
          <div>
            <ShadcnSelect
              value={serviceId}
              onValueChange={(val) => {
                setServiceId(val);
                setPage(1);
              }}
              options={serviceSelectOptions}
              placeholder="Xizmat"
            />
          </div>

          {/* Date Picker */}
          <div>
            <Input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setPage(1);
              }}
              className="h-10 text-xs"
            />
          </div>

          {/* Sort Selector */}
          <div>
            <ShadcnSelect
              value={sort}
              onValueChange={(val) => {
                setSort(val as AppointmentSortOption);
                setPage(1);
              }}
              options={sortOptions}
              placeholder="Saralash"
            />
          </div>
        </div>
      </div>

      {/* Content Table */}
      {isLoading && !isPlaceholderData ? (
        <AppointmentsTableSkeleton rows={Math.min(limit, 8)} />
      ) : appointments.length === 0 ? (
        <EmptyState
          title="Qabullar topilmadi"
          description={
            hasActiveFilters
              ? 'Tanlangan qidiruv va filtrlarga mos keluvchi qabul topilmadi.'
              : 'Hozircha hech qanday qabul ro\'yxatga olinmagan.'
          }
          action={
            <Button
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>Yangi qabul yozish</span>
            </Button>
          }
        />
      ) : (
        <Card className="shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3.5">Qabul Sanasi & Vaqti</th>
                  <th className="px-5 py-3.5">Bemor</th>
                  <th className="px-5 py-3.5">Shifokor & Xizmat</th>
                  <th className="px-5 py-3.5">Izoh</th>
                  <th className="px-5 py-3.5">Holati</th>
                  <th className="px-5 py-3.5 text-right">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="text-sm font-semibold text-slate-800">
                        {formatDate(app.date)}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{app.time}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">{app.patientName}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">
                        {app.patientPhone}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-800">
                        {doctorMap.get(app.doctorId) || app.doctorId}
                      </div>
                      <div className="text-xs text-slate-500">
                        {serviceMap.get(app.serviceId) || app.serviceId}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-xs text-slate-500 max-w-xs truncate">
                      {app.notes || '—'}
                    </td>

                    <td className="px-5 py-4 w-44">
                      <ShadcnSelect
                        value={app.status}
                        onValueChange={(val) =>
                          handleStatusChange(app, val as AppointmentStatus)
                        }
                        options={[
                          { value: 'pending', label: 'Kutilmoqda' },
                          { value: 'confirmed', label: 'Tasdiqlangan' },
                          { value: 'completed', label: 'Tugallandi' },
                          { value: 'cancelled', label: 'Bekor qilindi' },
                          { value: 'no_show', label: 'Kelmadi' },
                        ]}
                        triggerClassName="h-8 text-xs font-medium"
                      />
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(app)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Qabulni o'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        </Card>
      )}

      <AppointmentCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctors={doctors}
        services={services}
      />

      <ConfirmDeleteModal
        isOpen={!!appointmentToDelete}
        onClose={() => setAppointmentToDelete(null)}
        onConfirm={confirmDelete}
        itemName={
          appointmentToDelete
            ? `${appointmentToDelete.patientName} (${formatDate(appointmentToDelete.date)})`
            : ''
        }
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
