import React, { useState, useMemo } from 'react';
import {
  Search,
  UserPlus,
  Trash2,
  Edit,
  Award,
  GraduationCap,
  Languages,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDoctors, deleteDoctor } from '@/api/doctors.api';
import { getAllSpecialties } from '@/api/specialties.api';
import { Doctor, DoctorSortOption, DoctorGender } from '@/types/doctor.types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShadcnSelect } from '@/components/ui/select';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { DoctorsTableSkeleton } from '@/components/common/Skeletons';
import { DoctorModal } from './DoctorModal';
import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal';
import { formatCurrency } from '@/utils/format';
import { useToast } from '@/context/ToastContext';
import { useDebounce } from '@/hooks/useDebounce';

const sortOptions = [
  { value: 'rating-desc', label: 'Reyting (Yuqori)' },
  { value: 'name-asc', label: 'Ism (A - Z)' },
  { value: 'name-desc', label: 'Ism (Z - A)' },
  { value: 'experience-desc', label: 'Tajriba (Katta)' },
  { value: 'price-asc', label: 'Narx (Arzon)' },
  { value: 'price-desc', label: 'Narx (Qimmat)' },
];

const genderOptions = [
  { value: 'ALL', label: 'Barcha jinslar' },
  { value: 'male', label: 'Erkak shifokorlar' },
  { value: 'female', label: 'Ayol shifokorlar' },
];

export const DoctorsList: React.FC = () => {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  const [gender, setGender] = useState<string>('ALL');
  const [sort, setSort] = useState<DoctorSortOption>('rating-desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const debouncedSearch = useDebounce(search, 400);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState<Doctor | null>(null);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);

  // Fetch all specialties for the dropdown filter and modal
  const { data: specialties = [] } = useQuery({
    queryKey: ['specialties', 'all'],
    queryFn: getAllSpecialties,
  });

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: [
      'doctors',
      { search: debouncedSearch, specialtyId: selectedSpecialty, gender, sort, page, limit },
    ],
    queryFn: () =>
      getDoctors({
        search: debouncedSearch.trim() || undefined,
        specialtyId: selectedSpecialty !== 'ALL' ? selectedSpecialty : undefined,
        gender: gender !== 'ALL' ? (gender as DoctorGender) : undefined,
        sort,
        page,
        limit,
      }),
  });

  const doctors = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const specialtyMap = useMemo(() => {
    const map = new Map<string, string>();
    specialties.forEach((sp) => map.set(sp.id, sp.name));
    return map;
  }, [specialties]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDoctor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['clinic'] });
      success("Shifokor bazadan muvaffaqiyatli o'chirildi");
      setDoctorToDelete(null);
    },
    onError: (err: Error) => {
      toastError("O'chirishda xatolik", err.message);
    },
  });

  const handleDelete = (doc: Doctor) => {
    setDoctorToDelete(doc);
  };

  const confirmDelete = () => {
    if (doctorToDelete) {
      deleteMutation.mutate(doctorToDelete.id);
    }
  };

  const handleEdit = (doc: Doctor) => {
    setDoctorToEdit(doc);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setDoctorToEdit(null);
    setIsModalOpen(true);
  };

  const specialtySelectOptions = [
    { value: 'ALL', label: `Barcha mutaxassisliklar (${specialties.length})` },
    ...specialties.map((sp) => ({ value: sp.id, label: sp.name })),
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Klinika Shifokorlari</h1>
          <p className="text-sm text-slate-500 mt-1">
            Backend bazasidagi barcha mutaxassislar ro'yxati va ularning to'liq profillari
          </p>
        </div>

        <Button
          onClick={handleAddNew}
          className="shrink-0 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
        >
          <UserPlus className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">Yangi shifokor qo'shish</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Shifokor ismi, unvoni, tillari bo'yicha qidiruv..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Specialty Filter */}
          <div className="w-full sm:w-52">
            <ShadcnSelect
              value={selectedSpecialty}
              onValueChange={(val) => {
                setSelectedSpecialty(val);
                setPage(1);
              }}
              options={specialtySelectOptions}
              placeholder="Mutaxassislik"
            />
          </div>

          {/* Gender Filter */}
          <div className="w-full sm:w-44">
            <ShadcnSelect
              value={gender}
              onValueChange={(val) => {
                setGender(val);
                setPage(1);
              }}
              options={genderOptions}
              placeholder="Jinsi"
            />
          </div>

          {/* Sort Selector */}
          <div className="w-full sm:w-48">
            <ShadcnSelect
              value={sort}
              onValueChange={(val) => {
                setSort(val as DoctorSortOption);
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
        <DoctorsTableSkeleton rows={Math.min(limit, 8)} />
      ) : doctors.length === 0 ? (
        <EmptyState
          title="Shifokor topilmadi"
          description={
            search || selectedSpecialty !== 'ALL' || gender !== 'ALL'
              ? 'Tanlangan qidiruv va filtrlarga mos keluvchi shifokor topilmadi.'
              : 'Hozircha hech qanday shifokor bazada mavjud emas.'
          }
          action={
            <Button
              size="sm"
              onClick={handleAddNew}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 inline-flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5 shrink-0" />
              <span>Birinchi shifokorni qo'shish</span>
            </Button>
          }
        />
      ) : (
        <Card className="shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3.5">Shifokor</th>
                  <th className="px-5 py-3.5">Mutaxassislik & Unvon</th>
                  <th className="px-5 py-3.5">Narxi & Tajriba</th>
                  <th className="px-5 py-3.5">Ta'lim & Tillari</th>
                  <th className="px-5 py-3.5 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doctors.map((doc) => {
                  const specName =
                    doc.specialtyIds?.map((id) => specialtyMap.get(id) || id).join(', ') ||
                    'Belgilanmagan';

                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
                            {doc.photoInitials || doc.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{doc.fullName}</div>
                            <div className="text-xs font-mono text-slate-400">{doc.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold mb-1">
                          {specName}
                        </span>
                        <div className="text-xs text-slate-500 line-clamp-1">{doc.title}</div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="text-xs font-semibold text-emerald-600">
                          {formatCurrency(doc.consultationPrice)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          <span>{doc.experienceYears} yil tajriba</span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 text-xs text-slate-700">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[200px]">
                            {doc.education?.[0] || 'Keltirilmagan'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                          <Languages className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{doc.languages?.join(', ') || "O'zbek"}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEdit(doc)}
                            className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                            title="Tahrirlash"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(doc)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="O'chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

      {/* Create / Edit Modal */}
      <DoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctorToEdit={doctorToEdit}
        specialties={specialties}
      />

      {/* Universal Reusable Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!doctorToDelete}
        onClose={() => setDoctorToDelete(null)}
        onConfirm={confirmDelete}
        itemName={doctorToDelete?.fullName}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
