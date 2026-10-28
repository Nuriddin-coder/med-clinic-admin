import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDoctor, updateDoctor } from '@/api/doctors.api';
import { Doctor, CreateDoctorDto } from '@/types/doctor.types';
import { Specialty } from '@/types/specialty.types';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Textarea } from '@/components/common/Textarea';
import { Button } from '@/components/common/Button';
import { useToast } from '@/context/ToastContext';

const doctorSchema = z.object({
  fullName: z.string().min(3, { message: 'Ism va familiya kamida 3 ta harf bo\'lishi kerak' }),
  specialtyId: z.string().min(1, { message: 'Mutaxassislikni tanlang' }),
  title: z.string().min(2, { message: 'Lavozim yoki toifani kiriting (masalan: Oliy toifali kardiolog)' }),
  experienceYears: z.coerce.number().min(0, { message: 'Tajriba 0 dan kam bo\'lmasligi kerak' }),
  consultationPrice: z.coerce.number().min(1000, { message: 'Narx kamida 1,000 so\'m bo\'lishi kerak' }),
  gender: z.enum(['male', 'female']),
  bio: z.string().min(5, { message: 'Qisqacha biografiya kiriting' }),
  languages: z.string().min(1, { message: 'Tillarni vergul bilan kiriting (masalan: O\'zbek, Rus)' }),
  education: z.string().min(1, { message: 'Ta\'lim ma\'lumotini kiriting' }),
});

type DoctorFormData = z.infer<typeof doctorSchema>;

export interface DoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorToEdit?: Doctor | null;
  specialties: Specialty[];
}

export const DoctorModal: React.FC<DoctorModalProps> = ({
  isOpen,
  onClose,
  doctorToEdit,
  specialties,
}) => {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const isEditing = !!doctorToEdit;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      fullName: '',
      specialtyId: '',
      title: '',
      experienceYears: 5,
      consultationPrice: 150000,
      gender: 'male',
      bio: '',
      languages: 'O\'zbek, Rus',
      education: 'Toshkent Tibbiyot Akademiyasi',
    },
  });

  useEffect(() => {
    if (doctorToEdit) {
      reset({
        fullName: doctorToEdit.fullName,
        specialtyId: doctorToEdit.specialtyIds?.[0] || '',
        title: doctorToEdit.title,
        experienceYears: doctorToEdit.experienceYears,
        consultationPrice: doctorToEdit.consultationPrice,
        gender: doctorToEdit.gender || 'male',
        bio: doctorToEdit.bio,
        languages: doctorToEdit.languages?.join(', ') || 'O\'zbek, Rus',
        education: doctorToEdit.education?.join(', ') || '',
      });
    } else {
      reset({
        fullName: '',
        specialtyId: specialties[0]?.id || '',
        title: '',
        experienceYears: 5,
        consultationPrice: 150000,
        gender: 'male',
        bio: '',
        languages: 'O\'zbek, Rus',
        education: 'Toshkent Tibbiyot Akademiyasi',
      });
    }
  }, [doctorToEdit, reset, specialties]);

  const mutation = useMutation({
    mutationFn: async (data: DoctorFormData) => {
      const payload: CreateDoctorDto = {
        fullName: data.fullName,
        specialtyIds: [data.specialtyId],
        title: data.title,
        experienceYears: Number(data.experienceYears),
        consultationPrice: Number(data.consultationPrice),
        gender: data.gender,
        bio: data.bio,
        languages: data.languages.split(',').map((s) => s.trim()).filter(Boolean),
        education: data.education.split(',').map((s) => s.trim()).filter(Boolean),
        photoInitials: data.fullName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
      };

      if (isEditing && doctorToEdit) {
        return updateDoctor(doctorToEdit.id, payload);
      } else {
        return createDoctor(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['clinic'] });
      success(
        isEditing ? 'Shifokor ma\'lumotlari yangilandi' : 'Yangi shifokor muvaffaqiyatli qo\'shildi'
      );
      onClose();
    },
    onError: (err: Error) => {
      toastError('Xatolik', err.message);
    },
  });

  const onSubmit = (data: DoctorFormData) => {
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
      title={isEditing ? 'Shifokor ma\'lumotlarini tahrirlash' : 'Yangi shifokor qo\'shish'}
      description="Haqiqiy backend bazasiga shifokor ma'lumotlarini kiritish va tahrirlash"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="To'liq F.I.Sh"
            placeholder="Masalan: Dr. Sardor Ikromov"
            error={errors.fullName?.message}
            {...register('fullName')}
          />

          <Controller
            control={control}
            name="specialtyId"
            render={({ field }) => (
              <Select
                label="Mutaxassislik"
                placeholder="Mutaxassislikni tanlang"
                options={specialtyOptions}
                value={field.value}
                onValueChange={field.onChange}
                error={errors.specialtyId?.message}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Lavozim / Unvon"
            placeholder="Masalan: Bosh kardiolog, t.f.n"
            error={errors.title?.message}
            {...register('title')}
          />

          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Select
                label="Jinsi"
                options={[
                  { value: 'male', label: 'Erkak' },
                  { value: 'female', label: 'Ayol' },
                ]}
                value={field.value}
                onValueChange={field.onChange}
                error={errors.gender?.message}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Konsultatsiya narxi (so'mda)"
            type="number"
            placeholder="180000"
            error={errors.consultationPrice?.message}
            {...register('consultationPrice')}
          />

          <Input
            label="Tajriba (yil)"
            type="number"
            placeholder="10"
            error={errors.experienceYears?.message}
            {...register('experienceYears')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Muloqot tillari"
            placeholder="O'zbek, Rus, Ingliz"
            helperText="Vergul bilan ajratib yozing"
            error={errors.languages?.message}
            {...register('languages')}
          />

          <Input
            label="Ta'lim dargohi"
            placeholder="Toshkent Tibbiyot Akademiyasi"
            helperText="Oliy ta'lim va stajirovkalar"
            error={errors.education?.message}
            {...register('education')}
          />
        </div>

        <Textarea
          label="Biografiya va kasbiy ma'lumot"
          rows={3}
          placeholder="Shifokor haqida qisqacha ma'lumot, davolash usullari va yutuqlari..."
          error={errors.bio?.message}
          {...register('bio')}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {isEditing ? 'O\'zgarishlarni saqlash' : 'Shifokorni qo\'shish'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

