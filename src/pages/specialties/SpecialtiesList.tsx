import React, { useState } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Edit,
  Sparkles,
  Stethoscope,
  Heart,
  Brain,
  Activity,
  Smile,
  Eye,
  Pill,
  ArrowUpDown,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSpecialties, deleteSpecialty } from '@/api/specialties.api';
import { Specialty, SpecialtySortOption } from '@/types/specialty.types';
import { Card, CardBody } from '@/components/common/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShadcnSelect } from '@/components/ui/select';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { SpecialtiesGridSkeleton } from '@/components/common/Skeletons';
import { SpecialtyModal } from './SpecialtyModal';
import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal';
import { useToast } from '@/context/ToastContext';
import { useDebounce } from '@/hooks/useDebounce';

const iconRenderMap: Record<string, React.ReactNode> = {
  stethoscope: <Stethoscope className="w-5 h-5 text-emerald-600" />,
  heart: <Heart className="w-5 h-5 text-rose-500" />,
  brain: <Brain className="w-5 h-5 text-indigo-500" />,
  activity: <Activity className="w-5 h-5 text-teal-600" />,
  flower2: <Sparkles className="w-5 h-5 text-amber-500" />,
  smile: <Smile className="w-5 h-5 text-sky-500" />,
  eye: <Eye className="w-5 h-5 text-blue-500" />,
  pill: <Pill className="w-5 h-5 text-purple-500" />,
};

const sortOptions = [
  { value: 'name-asc', label: 'Nomi (A - Z)' },
  { value: 'name-desc', label: 'Nomi (Z - A)' },
];

export const SpecialtiesList: React.FC = () => {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SpecialtySortOption>('name-asc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const debouncedSearch = useDebounce(search, 400);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [specialtyToEdit, setSpecialtyToEdit] = useState<Specialty | null>(null);
  const [specialtyToDelete, setSpecialtyToDelete] = useState<Specialty | null>(null);

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['specialties', { search: debouncedSearch, sort, page, limit }],
    queryFn: () =>
      getSpecialties({
        search: debouncedSearch.trim() || undefined,
        sort,
        page,
        limit,
      }),
  });

  const specialties = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSpecialty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialties'] });
      success("Mutaxassislik muvaffaqiyatli o'chirildi");
      setSpecialtyToDelete(null);
    },
    onError: (err: Error) => {
      toastError("O'chirishda xatolik", err.message);
    },
  });

  const handleDelete = (sp: Specialty) => {
    setSpecialtyToDelete(sp);
  };

  const confirmDelete = () => {
    if (specialtyToDelete) {
      deleteMutation.mutate(specialtyToDelete.id);
    }
  };

  const handleEdit = (sp: Specialty) => {
    setSpecialtyToEdit(sp);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSpecialtyToEdit(null);
    setIsModalOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSort(value as SpecialtySortOption);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Klinika Mutaxassisliklari</h1>
          <p className="text-sm text-slate-500 mt-1">
            Klinikada mavjud barcha yo'nalishlar, shifokorlar va xizmatlar sohalari
          </p>
        </div>

        <Button
          onClick={handleAddNew}
          className="shrink-0 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">Yangi mutaxassislik</span>
        </Button>
      </div>

      {/* Filter and Sorting Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Mutaxassislik nomi yoki tavsifi bo'yicha qidiruv..."
            value={search}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto w-full md:w-64">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          <ShadcnSelect
            value={sort}
            onValueChange={handleSortChange}
            options={sortOptions}
            placeholder="Saralash"
          />
        </div>
      </div>

      {/* Content */}
      {isLoading && !isPlaceholderData ? (
        <SpecialtiesGridSkeleton count={Math.min(limit, 6)} />
      ) : specialties.length === 0 ? (
        <EmptyState
          title="Mutaxassislik topilmadi"
          description={
            search
              ? `"${search}" bo'yicha hech qanday natija chiqmadi.`
              : "Hozircha hech qanday mutaxassislik yo'nalishi mavjud emas."
          }
          action={
            <Button
              size="sm"
              onClick={handleAddNew}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>Yangi yo'nalish qo'shish</span>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialties.map((sp) => {
              const iconNode = iconRenderMap[sp.icon] || <Sparkles className="w-5 h-5 text-emerald-600" />;

              return (
                <Card
                  key={sp.id}
                  className="hover:border-slate-300 transition-all shadow-2xs flex flex-col justify-between"
                >
                  <CardBody className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                        {iconNode}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(sp)}
                          className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="Tahrirlash"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sp)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-800 text-base mt-3">{sp.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">
                      {sp.description}
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>ID: {sp.id}</span>
                      <span className="capitalize text-slate-500 font-sans">{sp.icon}</span>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={setLimit}
            />
          </div>
        </div>
      )}

      <SpecialtyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        specialtyToEdit={specialtyToEdit}
      />

      <ConfirmDeleteModal
        isOpen={!!specialtyToDelete}
        onClose={() => setSpecialtyToDelete(null)}
        onConfirm={confirmDelete}
        itemName={specialtyToDelete?.name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
