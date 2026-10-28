import { apiClient } from './client';
import {
  Appointment,
  CreateAppointmentDto,
  UpdateAppointmentDto,
  AppointmentQueryParams,
} from '@/types/appointment.types';
import { PaginatedResponse } from '@/types/pagination.types';

export const getAppointments = async (
  params?: AppointmentQueryParams
): Promise<PaginatedResponse<Appointment>> => {
  const cleanParams: Record<string, unknown> = {};
  if (params) {
    if (params.search?.trim()) cleanParams.search = params.search.trim();
    if (params.phone?.trim()) cleanParams.phone = params.phone.trim();
    if (params.doctorId && params.doctorId !== 'ALL') {
      cleanParams.doctorId = params.doctorId;
    }
    if (params.serviceId && params.serviceId !== 'ALL') {
      cleanParams.serviceId = params.serviceId;
    }
    if (params.date?.trim()) cleanParams.date = params.date.trim();
    if (params.status && params.status !== 'ALL') {
      cleanParams.status = params.status;
    }
    if (params.sort) cleanParams.sort = params.sort;
    if (params.page) cleanParams.page = params.page;
    if (params.limit) cleanParams.limit = params.limit;
  }

  const { data } = await apiClient.get<PaginatedResponse<Appointment>>('/appointments', {
    params: cleanParams,
  });
  return data;
};

export const getAllAppointments = async (): Promise<Appointment[]> => {
  const res = await getAppointments({ limit: 100 });
  return res.data;
};

export const getAppointmentById = async (id: string): Promise<Appointment> => {
  const { data } = await apiClient.get<Appointment>(`/appointments/${id}`);
  return data;
};

export const createAppointment = async (dto: CreateAppointmentDto): Promise<Appointment> => {
  const { data } = await apiClient.post<Appointment>('/appointments', dto);
  return data;
};

export const updateAppointmentStatus = async (
  id: string,
  dto: UpdateAppointmentDto
): Promise<Appointment> => {
  const { data } = await apiClient.patch<Appointment>(`/appointments/${id}`, dto);
  return data;
};

export const cancelAppointment = async (
  id: string,
  phone: string
): Promise<{ success: boolean; message?: string }> => {
  const { data } = await apiClient.patch(`/appointments/${id}/cancel`, { phone });
  return data;
};

export const deleteAppointment = async (
  id: string
): Promise<{ success: boolean; message?: string }> => {
  const { data } = await apiClient.delete(`/appointments/${id}`);
  return data;
};
