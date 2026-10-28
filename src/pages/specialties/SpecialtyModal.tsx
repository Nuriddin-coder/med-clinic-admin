import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSpecialty, updateSpecialty } from '@/api/specialties.api';
import { Specialty, CreateSpecialtyDto } from '@/types/specialty.types';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { useToast } from '@/context/ToastContext';

const specialtySchema = z.object({
  name: z.string().min(2, { message: 'Mutaxassislik nomi kamida 2 ta harfdan iborat bo\'lishi kerak' }),
  description: z.string().min(5, { message: 'Tavsif kamida 5 ta belgidan iborat bo\'lishi kerak' }),
  icon: z.string().min(1, { message: 'Ikonkani tanlang' }),
});

type SpecialtyFormData = z.infer<typeof specialtySchema>;

const iconOptions = [
  { value: 'stethoscope', label: 'Stetoskop (Umumiy / Terapiya)' },
  { value: 'heart', label: 'Yurak (Kardiologiya)' },
  { value: 'brain', label: 'Miya (Nevrologiya)' },
  { value: 'activity', label: 'Kardiogramma / Puls' },
  { value: 'flower2', label: 'Gullar (Dermatologiya)' },
  { value: 'eye', label: 'Ko\'z (Oftalmologiya)' },
  { value: 'smile', label: 'Tabassum (Stomatologiya)' },
  { value: 'scan', label: 'Rentgen / Skaner' },
  { value: 'pill', label: 'Dori / Farmatsevtika' },
];

export interface SpecialtyModalProps {
  isOpen: boolean;
  onClose: () => void;
  specialtyToEdit?: Specialty | null;
}

export const SpecialtyModal: React.FC<SpecialtyModalProps> = ({
  isOpen,
  onClose,
  specialtyToEdit,
}) => {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const isEditing = !!specialtyToEdit;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SpecialtyFormData>({
    resolver: zodResolver(specialtySchema),
    defaultValues: {
      name: '',
      description: '',
      icon: 'stethoscope',
    },
  });

  useEffect(() => {
    if (specialtyToEdit) {
      reset({
        name: specialtyToEdit.name,
        description: specialtyToEdit.description,
        icon: specialtyToEdit.icon || 'stethoscope',
      });
    } else {
      reset({
        name: '',
        description: '',
        icon: 'stethoscope',
      });
    }
  }, [specialtyToEdit, reset]);

  const mutation = useMutation({
    mutationFn: async (data: SpecialtyFormData) => {
      const payload: CreateSpecialtyDto = {
        name: data.name,
        description: data.description,
        icon: data.icon,
      };

      if (isEditing && specialtyToEdit) {
        return updateSpecialty(specialtyToEdit.id, payload);
      } else {
        return createSpecialty(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialties'] });
      success(
        isEditing
          ? 'Mutaxassislik muvaffaqiyatli yangilandi'
          : 'Yangi mutaxassislik qo\'shildi'
      );
      onClose();
    },
    onError: (err: Error) => {
      toastError('Xatolik', err.message);
    },
  });

  const onSubmit = (data: SpecialtyFormData) => {
    mutation.mutate(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Mutaxassislikni tahrirlash' : 'Yangi mutaxassislik qo\'shish'}
      description="Klinika mutaxassislik yo'nalishini boshqarish"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Mutaxassislik nomi"
          placeholder="Masalan: Kardiologiya"
          error={errors.name?.message}
          {...register('name')}
        />

        <Controller
          control={control}
          name="icon"
          render={({ field }) => (
            <Select
              label="Ikonka turi"
              options={iconOptions}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.icon?.message}
            />
          )}
        />

        <Textarea
          label="Tavsif"
          rows={3}
          placeholder="Ushbu sohada qanday kasalliklar tashxis qilinadi va davolanadi..."
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {isEditing ? 'Saqlash' : 'Qo\'shish'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

