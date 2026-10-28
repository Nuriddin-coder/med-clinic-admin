import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createService, updateService } from '@/api/services.api';
import { MedicalService, CreateServiceDto } from '@/types/service.types';
import { Specialty } from '@/types/specialty.types';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';
import { useToast } from '@/context/ToastContext';

const serviceSchema = z.object({
  name: z.string().min(2, { message: 'Xizmat nomi kiritilishi shart' }),
  description: z.string().min(5, { message: 'Xizmat tavsifi kamida 5 ta harf bo\'lishi kerak' }),
  specialtyId: z.string().min(1, { message: 'Tegishli mutaxassislikni tanlang' }),
  durationMinutes: z.coerce.number().min(5, { message: 'Davomiyligi kamida 5 daqiqa bo\'lishi kerak' }),
  price: z.coerce.number().min(1000, { message: 'Narx kamida 1,000 so\'m bo\'lishi kerak' }),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceToEdit?: MedicalService | null;
  specialties: Specialty[];
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  serviceToEdit,
  specialties,
}) => {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const isEditing = !!serviceToEdit;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      specialtyId: '',
      durationMinutes: 30,
      price: 150000,
    },
  });

  useEffect(() => {
    if (serviceToEdit) {
      reset({
        name: serviceToEdit.name,
        description: serviceToEdit.description,
        specialtyId: serviceToEdit.specialtyId,
        durationMinutes: serviceToEdit.durationMinutes,
        price: serviceToEdit.price,
      });
    } else {
      reset({
        name: '',
        description: '',
        specialtyId: specialties[0]?.id || '',
        durationMinutes: 30,
        price: 150000,
      });
    }
  }, [serviceToEdit, reset, specialties]);

  const mutation = useMutation({
    mutationFn: async (data: ServiceFormData) => {
      const payload: CreateServiceDto = {
        name: data.name,
        description: data.description,
        specialtyId: data.specialtyId,
        durationMinutes: Number(data.durationMinutes),
        price: Number(data.price),
      };

      if (isEditing && serviceToEdit) {
        return updateService(serviceToEdit.id, payload);
      } else {
        return createService(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      success(isEditing ? 'Xizmat yangilandi' : 'Yangi xizmat qo\'shildi');
      onClose();
    },
    onError: (err: Error) => {
      toastError('Xatolik', err.message);
    },
  });

  const onSubmit = (data: ServiceFormData) => {
    mutation.mutate(data);
  };

  const specialtyOptions = specialties.map((sp) => ({
    value: sp.id,
    label: sp.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Xizmatni tahrirlash' : 'Yangi xizmat qo\'shish'}
      description="Klinika tibbiy xizmatlari va narxlar preyskurantini boshqarish"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Xizmat nomi"
          placeholder="Masalan: EKG tekshiruvi va shifokor xulosasi"
          error={errors.name?.message}
          {...register('name')}
        />

        <Controller
          control={control}
          name="specialtyId"
          render={({ field }) => (
            <Select
              label="Mutaxassislik yo'nalishi"
              value={field.value}
              onValueChange={field.onChange}
              options={specialtyOptions}
              error={errors.specialtyId?.message}
              placeholder="Mutaxassislikni tanlang..."
            />
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Narxi (so'mda)"
            type="number"
            placeholder="150000"
            error={errors.price?.message}
            {...register('price')}
          />

          <Input
            label="Davomiyligi (daqiqa)"
            type="number"
            placeholder="30"
            error={errors.durationMinutes?.message}
            {...register('durationMinutes')}
          />
        </div>

        <Textarea
          label="Xizmat tavsifi"
          rows={3}
          placeholder="Xizmat doirasida qanday amallar bajariladi..."
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

