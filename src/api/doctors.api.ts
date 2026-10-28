import { apiClient } from './client';
import {
  Doctor,
  CreateDoctorDto,
  UpdateDoctorDto,
  DoctorQueryParams,
} from '@/types/doctor.types';
import { PaginatedResponse } from '@/types/pagination.types';

export const getDoctors = async (
  params?: DoctorQueryParams
): Promise<PaginatedResponse<Doctor>> => {
  const cleanParams: Record<string, unknown> = {};
  if (params) {
    if (params.search?.trim()) cleanParams.search = params.search.trim();
    if (params.specialtyId && params.specialtyId !== 'ALL') {
      cleanParams.specialtyId = params.specialtyId;
    }
    if (params.gender) {
      cleanParams.gender = params.gender;
    }
    if (params.sort) cleanParams.sort = params.sort;
    if (params.page) cleanParams.page = params.page;
    if (params.limit) cleanParams.limit = params.limit;
  }

  const { data } = await apiClient.get<PaginatedResponse<Doctor>>('/doctors', {
    params: cleanParams,
  });
  return data;
};

export const getAllDoctors = async (): Promise<Doctor[]> => {
  const res = await getDoctors({ limit: 100 });
  return res.data;
};

export const getDoctorById = async (id: string): Promise<Doctor> => {
  const { data } = await apiClient.get<Doctor>(`/doctors/${id}`);
  return data;
};

export const createDoctor = async (dto: CreateDoctorDto): Promise<Doctor> => {
  const { data } = await apiClient.post<Doctor>('/doctors', dto);
  return data;
};

export const updateDoctor = async (id: string, dto: UpdateDoctorDto): Promise<Doctor> => {
  const { data } = await apiClient.patch<Doctor>(`/doctors/${id}`, dto);
  return data;
};

export const deleteDoctor = async (id: string): Promise<{ success: boolean; message?: string }> => {
  const { data } = await apiClient.delete(`/doctors/${id}`);
  return data;
};
