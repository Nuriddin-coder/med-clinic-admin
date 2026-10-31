import React, { useState } from 'react';
import { Mail, Phone, Trash2, Search, Calendar, MessageSquare, ArrowUpDown } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getContacts, deleteContact } from '@/api/contact.api';
import { ContactMessage, ContactSortOption } from '@/types/contact.types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShadcnSelect } from '@/components/ui/select';
import { EmptyState } from '@/components/common/EmptyState';
import { Modal } from '@/components/common/Modal';
import { Pagination } from '@/components/common/Pagination';
import { ContactTableSkeleton } from '@/components/common/Skeletons';
import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal';
import { formatDateTime } from '@/utils/format';
import { useToast } from '@/context/ToastContext';
import { useDebounce } from '@/hooks/useDebounce';

const sortOptions = [
  { value: 'createdAt-desc', label: 'Yangi xabarlar birinchi' },
  { value: 'createdAt-asc', label: 'Eski xabarlar birinchi' },
  { value: 'name-asc', label: 'Ism (A - Z)' },
  { value: 'name-desc', label: 'Ism (Z - A)' },
];

export const ContactList: React.FC = () => {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<ContactSortOption>('createdAt-desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const debouncedSearch = useDebounce(search, 400);

  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['contacts', { search: debouncedSearch, sort, page, limit }],
    queryFn: () =>
      getContacts({
        search: debouncedSearch.trim() || undefined,
        sort,
        page,
        limit,
      }),
  });

  const contacts = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      success("Murojaat muvaffaqiyatli o'chirildi");
      setSelectedMessage(null);
      setMessageToDelete(null);
    },
    onError: (err: Error) => {
      toastError("O'chirishda xatolik", err.message);
    },
  });

  const handleDelete = (msg: ContactMessage) => {
    setMessageToDelete(msg);
  };

  const confirmDelete = () => {
    if (messageToDelete) {
      deleteMutation.mutate(messageToDelete.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Kelib Tushgan Murojaatlar</h1>
          <p className="text-sm text-slate-500 mt-1">
            Mijozlarning onlayn sayt orqali yuborgan xabarlari, savollari va qayta aloqa so'rovlari
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Ism, telefon, email yoki xabar matni bo'yicha qidiruv..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto w-full md:w-64">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          <ShadcnSelect
            value={sort}
            onValueChange={(val) => {
              setSort(val as ContactSortOption);
              setPage(1);
            }}
            options={sortOptions}
            placeholder="Saralash"
          />
        </div>
      </div>

      {/* Content Table */}
      {isLoading && !isPlaceholderData ? (
        <ContactTableSkeleton rows={Math.min(limit, 8)} />
      ) : contacts.length === 0 ? (
        <EmptyState
          title="Murojaatlar topilmadi"
          description={
            search
              ? `"${search}" bo'yicha hech qanday murojaat topilmadi.`
              : 'Hozircha hech qanday yangi xabar kelib tushmagan.'
          }
        />
      ) : (
        <Card className="shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3.5">F.I.Sh & Vaqti</th>
                  <th className="px-5 py-3.5">Telefon & Email</th>
                  <th className="px-5 py-3.5">Xabar matni</th>
                  <th className="px-5 py-3.5 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contacts.map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">{msg.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {formatDateTime(msg.createdAt)}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 font-mono">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{msg.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{msg.email}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 max-w-md">
                      <p
                        onClick={() => setSelectedMessage(msg)}
                        className="text-xs text-slate-700 line-clamp-2 cursor-pointer hover:text-emerald-700 transition"
                        title="To'liq o'qish uchun bosing"
                      >
                        {msg.message}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedMessage(msg)}
                          className="h-8 text-xs font-medium"
                        >
                          Ko'rish
                        </Button>
                        <button
                          onClick={() => handleDelete(msg)}
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

      {/* View Message Modal */}
      <Modal
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        title="Murojaat tafsilotlari"
        description="Foydalanuvchi tomonidan yuborilgan to'liq murojaat ma'lumoti"
      >
        {selectedMessage && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Yuborilgan vaqt:</span>
                <span className="font-medium text-slate-700">
                  {formatDateTime(selectedMessage.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>F.I.Sh:</span>
                <span className="font-semibold text-slate-800">{selectedMessage.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Telefon:</span>
                <span className="font-mono text-slate-700">{selectedMessage.phone}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Elektron pochta:</span>
                <span className="text-slate-700">{selectedMessage.email}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Xabar matni
              </label>
              <div className="p-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(selectedMessage)}
                className="gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>O'chirish</span>
              </Button>

              <Button
                size="sm"
                onClick={() => (window.location.href = `tel:${selectedMessage.phone}`)}
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Phone className="w-4 h-4" />
                <span>Qo'ng'iroq qilish</span>
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDeleteModal
        isOpen={!!messageToDelete}
        onClose={() => setMessageToDelete(null)}
        onConfirm={confirmDelete}
        itemName={messageToDelete ? `${messageToDelete.name} murojaati` : ''}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
