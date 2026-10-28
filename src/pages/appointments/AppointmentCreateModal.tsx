import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAppointment } from '@/api/appointments.api';
import { Doctor } from '@/types/doctor.types';
import { MedicalService } from '@/types/service.types';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Textarea } from '@/components/common/Textarea';
import { Button } from '@/components/common/Button';
import { useToast } from '@/context/ToastContext';

const appointmentSchema = z.object({
  doctorId: z.string().min(1, { message: 'Shifokorni tanlang' }),
  serviceId: z.string().min(1, { message: 'Xizmat turini tanlang' }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Sana formati: YYYY-MM-DD bo\'lishi kerak' }),
  time: z.string().regex(/^\d{2}:\d{2}$/, { message: 'Vaqt formati: HH:MM bo\'lishi kerak' }),
  patientName: z.string().min(3, { message: 'Bemor ismi kamida 3 ta harf bo\'lishi kerak' }),
  patientPhone: z.string().regex(/^\+998[0-9]{9}$/, { message: 'Telefon formati: +998901234567 bo\'lishi kerak' }),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export interface AppointmentCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctors: Doctor[];
  services: MedicalService[];
}

export const AppointmentCreateModal: React.FC<AppointmentCreateModalProps> = ({
  isOpen,
  onClose,
  doctors,
  services,
}) => {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      doctorId: doctors[0]?.id || '',
      serviceId: services[0]?.id || '',
      date: tomorrowStr,
      time: '10:00',
      patientName: '',
      patientPhone: '+998',
      notes: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: AppointmentFormData) => createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      success('Qabul muvaffaqiyatli band qilindi');
      reset();
      onClose();
    },
    onError: (err: Error) => {
      toastError('Qabul yozishda xatolik', err.message);
    },
  });

  const onSubmit = (data: AppointmentFormData) => {
    mutation.mutate(data);
  };

  const doctorOptions = doctors.map((d) => ({
    value: d.id,
    label: `${d.fullName} (${d.title})`,
  }));

  const serviceOptions = services.map((s) => ({
    value: s.id,
    label: `${s.name} - ${s.price.toLocaleString()} so'm`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Yangi qabul yozish"
      description="Bemorni shifokor qabuliga rasmiylashtirish va tizimga kiritish"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          control={control}
          name="doctorId"
          render={({ field }) => (
            <Select
              label="Shifokor"
              placeholder="Shifokorni tanlang..."
              options={doctorOptions}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.doctorId?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="serviceId"
          render={({ field }) => (
            <Select
              label="Xizmat turi"
              placeholder="Xizmat turini tanlang..."
              options={serviceOptions}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.serviceId?.message}
            />
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Qabul sanasi"
            type="date"
            error={errors.date?.message}
            {...register('date')}
          />

          <Input
            label="Qabul vaqti"
            type="time"
            error={errors.time?.message}
            {...register('time')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Bemor F.I.Sh"
            placeholder="Ali Valiyev"
            error={errors.patientName?.message}
            {...register('patientName')}
          />

          <Input
            label="Telefon raqami"
            placeholder="+998901234567"
            error={errors.patientPhone?.message}
            {...register('patientPhone')}
          />
        </div>

        <Textarea
          label="Shikoyat yoki qo'shimcha izoh"
          rows={2}
          placeholder="Bosh og'rig'i, umumiy holsizlik..."
          error={errors.notes?.message}
          {...register('notes')}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button type="submit" isLoading={mutation.isPending}>
            Qabulni tasdiqlash
          </Button>
        </div>
      </form>
    </Modal>
  );
};

