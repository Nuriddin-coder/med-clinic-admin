import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Edit,
  Clock,
  ArrowUpDown,
  Filter,
  X,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getServices, deleteService } from '@/api/services.api';
import { getAllSpecialties } from '@/api/specialties.api';
import { MedicalService, ServiceSortOption } from '@/types/service.types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/common/NumberInput';
import { ShadcnSelect } from '@/components/ui/select';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { ServicesTableSkeleton } from '@/components/common/Skeletons';
import { ServiceModal } from './ServiceModal';
import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal';
import { formatCurrency, parseNumberFromFormatted } from '@/utils/format';
import { useToast } from '@/context/ToastContext';
import { useDebounce } from '@/hooks/useDebounce';

const sortOptions = [
  { value: 'name-asc', label: 'Nomi (A - Z)' },
  { value: 'name-desc', label: 'Nomi (Z - A)' },
  { value: 'price-asc', label: 'Narx (Arzon)' },
  { value: 'price-desc', label: 'Narx (Qimmat)' },
  { value: 'duration-asc', label: 'Davomiyligi (Qisqa)' },
  { value: 'duration-desc', label: 'Davomiyligi (Uzoq)' },
];

export const ServicesList: React.FC = () => {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  const [sort, setSort] = useState<ServiceSortOption>('name-asc');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const debouncedSearch = useDebounce(search, 400);
  const debouncedMinPrice = useDebounce(minPrice, 400);
  const debouncedMaxPrice = useDebounce(maxPrice, 400);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<MedicalService | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<MedicalService | null>(null);

  // Fetch all specialties for filter dropdown and modal
  const { data: specialties = [] } = useQuery({
    queryKey: ['specialties', 'all'],
    queryFn: getAllSpecialties,
  });

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: [
      'services',
      {
        search: debouncedSearch,
        specialtyId: selectedSpecialty,
        minPrice: debouncedMinPrice,
        maxPrice: debouncedMaxPrice,
        sort,
        page,
        limit,
      },
    ],
    queryFn: () =>
      getServices({
        search: debouncedSearch.trim() || undefined,
        specialtyId: selectedSpecialty !== 'ALL' ? selectedSpecialty : undefined,
        minPrice: debouncedMinPrice ? parseNumberFromFormatted(debouncedMinPrice) : undefined,
        maxPrice: debouncedMaxPrice ? parseNumberFromFormatted(debouncedMaxPrice) : undefined,
        sort,
        page,
        limit,
      }),
  });

  const services = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const specialtyMap = useMemo(() => {
    const map = new Map<string, string>();
    specialties.forEach((sp) => map.set(sp.id, sp.name));
    return map;
  }, [specialties]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      success("Xizmat muvaffaqiyatli o'chirildi");
      setServiceToDelete(null);
    },
    onError: (err: Error) => {
      toastError("O'chirishda xatolik", err.message);
    },
  });

  const handleDelete = (srv: MedicalService) => {
    setServiceToDelete(srv);
  };

  const confirmDelete = () => {
    if (serviceToDelete) {
      deleteMutation.mutate(serviceToDelete.id);
    }
  };

  const handleEdit = (srv: MedicalService) => {
    setServiceToEdit(srv);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setServiceToEdit(null);
    setIsModalOpen(true);
  };

  const specialtySelectOptions = [
    { value: 'ALL', label: `Barcha sohalar (${specialties.length})` },
    ...specialties.map((sp) => ({ value: sp.id, label: sp.name })),
  ];

  const clearFilters = () => {
    setSearch('');
    setSelectedSpecialty('ALL');
    setMinPrice('');
    setMaxPrice('');
    setSort('name-asc');
    setPage(1);
  };

  const hasActiveFilters =
    search || selectedSpecialty !== 'ALL' || minPrice || maxPrice || sort !== 'name-asc';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Klinika Xizmatlari va Preyskurant</h1>
          <p className="text-sm text-slate-500 mt-1">
            Mavjud tibbiy tahlillar, muolajalar, ko'riklar va ularning rasmiy narxlari
          </p>
        </div>

        <Button
          onClick={handleAddNew}
          className="shrink-0 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">Yangi xizmat qo'shish</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[240px]">
            <Input
              type="text"
              placeholder="Xizmat nomi yoki tavsifi bo'yicha qidiruv..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>

          {/* Specialty Dropdown */}
          <div className="w-full lg:w-56">
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

          {/* Sort Dropdown */}
          <div className="w-full lg:w-52">
            <ShadcnSelect
              value={sort}
              onValueChange={(val) => {
                setSort(val as ServiceSortOption);
                setPage(1);
              }}
              options={sortOptions}
              placeholder="Saralash"
            />
          </div>
        </div>

        {/* Price Range Filter Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <span className="font-medium text-slate-500">Narx oralig'i (so'm):</span>
          <div className="w-32">
            <NumberInput
              placeholder="Min narx"
              value={minPrice}
              onChange={(_num, formatted) => {
                setMinPrice(formatted);
                setPage(1);
              }}
              className="h-8 text-xs font-normal"
            />
          </div>
          <span className="text-slate-400">—</span>
          <div className="w-32">
            <NumberInput
              placeholder="Max narx"
              value={maxPrice}
              onChange={(_num, formatted) => {
                setMaxPrice(formatted);
                setPage(1);
              }}
              className="h-8 text-xs font-normal"
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 text-xs text-slate-500 hover:text-rose-600 gap-1 ml-auto"
            >
              <X className="w-3.5 h-3.5" />
              Tozalash
            </Button>
          )}
        </div>
      </div>

      {/* Content Table */}
      {isLoading && !isPlaceholderData ? (
        <ServicesTableSkeleton rows={Math.min(limit, 8)} />
      ) : services.length === 0 ? (
        <EmptyState
          title="Xizmat topilmadi"
          description={
            hasActiveFilters
              ? 'Tanlangan qidiruv va filtrlarga mos xizmat topilmadi.'
              : 'Hozircha hech qanday tibbiy xizmat kiritilmagan.'
          }
          action={
            <Button
              size="sm"
              onClick={handleAddNew}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>Yangi xizmat qo'shish</span>
            </Button>
          }
        />
      ) : (
        <Card className="shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3.5">Xizmat Nomi</th>
                  <th className="px-5 py-3.5">Soha / Mutaxassislik</th>
                  <th className="px-5 py-3.5">Davomiyligi</th>
                  <th className="px-5 py-3.5">Narxi</th>
                  <th className="px-5 py-3.5 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map((srv) => (
                  <tr key={srv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">{srv.name}</div>
                      <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {srv.description}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                        {specialtyMap.get(srv.specialtyId) || srv.specialtyId}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {srv.durationMinutes} daqiqa
                      </span>
                    </td>

                    <td className="px-5 py-4 font-bold text-emerald-600 text-sm">
                      {formatCurrency(srv.price)}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(srv)}
                          className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="Tahrirlash"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(srv)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceToEdit={serviceToEdit}
        specialties={specialties}
      />

      <ConfirmDeleteModal
        isOpen={!!serviceToDelete}
        onClose={() => setServiceToDelete(null)}
        onConfirm={confirmDelete}
        itemName={serviceToDelete?.name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
