import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClinicInfo, patchClinicInfo } from '@/api/clinic.api';
import { UpdateClinicDto } from '@/types/clinic.types';
import { Card, CardHeader, CardBody } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { NumberInput } from '@/components/common/NumberInput';
import { Textarea } from '@/components/common/Textarea';
import { Button } from '@/components/common/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { Save, Building2, Phone, Mail, Clock, Award, Users } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { formatUzbekPhone, toCleanPhone } from '@/utils/format';

const clinicSettingsSchema = z.object({
  name: z.string().min(2, { message: 'Klinika nomi kiritilishi shart' }),
  tagline: z.string().min(3, { message: 'Klinika shiori kiritilishi shart' }),
  about: z.string().min(10, { message: 'Klinika haqida ma\'lumot kamida 10 ta belgi bo\'lishi kerak' }),
  address: z.string().min(5, { message: 'Manzil kiritilishi shart' }),
  phones: z.string().min(9, { message: 'Telefon raqamlarini vergul bilan kiriting' }),
  email: z.string().email({ message: 'To\'g\'ri elektron pochta manzilini kiriting' }),
  workingHoursLabel: z.string().min(3, { message: 'Ish vaqti tavsifi kiritilishi shart' }),
  years: z.coerce.number().min(0),
  patientCount: z.coerce.number().min(0),
  doctorCount: z.coerce.number().min(0),
});

type ClinicSettingsFormData = z.infer<typeof clinicSettingsSchema>;

export const Settings: React.FC = () => {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const { data: clinic, isLoading } = useQuery({
    queryKey: ['clinic'],
    queryFn: getClinicInfo,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<ClinicSettingsFormData>({
    resolver: zodResolver(clinicSettingsSchema),
  });

  useEffect(() => {
    if (clinic) {
      reset({
        name: clinic.name || '',
        tagline: clinic.tagline || '',
        about: clinic.about || '',
        address: clinic.address || '',
        phones: clinic.phones?.map(formatUzbekPhone).join(', ') || '',
        email: clinic.email || '',
        workingHoursLabel: clinic.workingHoursLabel || '',
        years: clinic.years || 0,
        patientCount: clinic.patientCount || 0,
        doctorCount: clinic.doctorCount || 0,
      });
    }
  }, [clinic, reset]);

  const mutation = useMutation({
    mutationFn: (dto: UpdateClinicDto) => patchClinicInfo(dto),
    onSuccess: (updated) => {
      queryClient.setQueryData(['clinic'], updated);
      queryClient.invalidateQueries({ queryKey: ['clinic'] });
      success('Klinika ma\'lumotlari muvaffaqiyatli saqlandi');
    },
    onError: (err: Error) => {
      toastError('Saqlashda xatolik', err.message);
    },
  });

  const onSubmit = (data: ClinicSettingsFormData) => {
    const payload: UpdateClinicDto = {
      name: data.name,
      tagline: data.tagline,
      about: data.about,
      address: data.address,
      phones: data.phones.split(',').map((p) => toCleanPhone(p.trim())).filter(Boolean),
      email: data.email,
      workingHoursLabel: data.workingHoursLabel,
      years: Number(data.years),
      patientCount: Number(data.patientCount),
      doctorCount: Number(data.doctorCount),
    };
    mutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div>
          <Skeleton className="h-7 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Card className="p-6 space-y-4">
          <Skeleton className="h-5 w-48 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-10 rounded-xl" />
            <Skeleton className="h-10 rounded-xl" />
          </div>
          <Skeleton className="h-24 rounded-xl" />
        </Card>
        <Card className="p-6 space-y-4">
          <Skeleton className="h-5 w-48 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-10 rounded-xl" />
            <Skeleton className="h-10 rounded-xl" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Klinika Tizim Sozlamalari</h1>
        <p className="text-sm text-slate-500 mt-1">
          Haqiqiy backenddagi klinika rekvizitlari, aloqa vositalari va ish tartibi
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Main Clinic Profile */}
        <Card>
          <CardHeader
            title="Asosiy Ma'lumotlar"
            subtitle="Klinika nomi, shiori va rasmiy tavsifi"
          />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Klinika nomi"
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label="Klinika shiori (Tagline)"
                error={errors.tagline?.message}
                {...register('tagline')}
              />
            </div>

            <Textarea
              label="Klinika haqida umumiy ma'lumot (About)"
              rows={3}
              error={errors.about?.message}
              {...register('about')}
            />

            <Input
              label="Klinika manzili"
              error={errors.address?.message}
              {...register('address')}
            />
          </CardBody>
        </Card>

        {/* Contacts & Working Hours */}
        <Card>
          <CardHeader
            title="Aloqa va Ish Tartibi"
            subtitle="Telefon raqamlar, email va ish grafigi tavsifi"
          />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Telefon raqamlar (vergul bilan)"
                placeholder="+998712000808, +998901234567"
                error={errors.phones?.message}
                {...register('phones')}
              />

              <Input
                label="Rasmiy elektron pochta (Email)"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <Input
              label="Ish vaqti grafigi"
              placeholder="Dushanba–Shanba 08:00–20:00, Yakshanba — dam olish"
              error={errors.workingHoursLabel?.message}
              {...register('workingHoursLabel')}
            />
          </CardBody>
        </Card>

        {/* Statistics & Numbers */}
        <Card>
          <CardHeader
            title="Statistika va Ko'rsatkichlar"
            subtitle="Mijozlar soni, tajriba va shifokorlar soni ko'rsatkichlari"
          />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Controller
                control={control}
                name="years"
                render={({ field }) => (
                  <NumberInput
                    label="Faoliyat yillari"
                    suffix="yil"
                    placeholder="10"
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                    error={errors.years?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="patientCount"
                render={({ field }) => (
                  <NumberInput
                    label="Davolangan bemorlar soni"
                    suffix="bemor"
                    placeholder="15 000"
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                    error={errors.patientCount?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="doctorCount"
                render={({ field }) => (
                  <NumberInput
                    label="Shifokorlar soni"
                    suffix="nafar"
                    placeholder="25"
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                    error={errors.doctorCount?.message}
                  />
                )}
              />
            </div>
          </CardBody>
        </Card>

        {/* Save button */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            isLoading={mutation.isPending}
            disabled={!isDirty && !mutation.isPending}
            size="lg"
            leftIcon={<Save className="w-5 h-5" />}
          >
            O'zgarishlarni saqlash
          </Button>
        </div>
      </form>
    </div>
  );
};

