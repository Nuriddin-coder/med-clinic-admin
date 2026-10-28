import { apiClient } from './client';
import {
  Specialty,
  CreateSpecialtyDto,
  UpdateSpecialtyDto,
  SpecialtyQueryParams,
} from '@/types/specialty.types';
import { PaginatedResponse } from '@/types/pagination.types';

export const getSpecialties = async (
  params?: SpecialtyQueryParams
): Promise<PaginatedResponse<Specialty>> => {
  const cleanParams: Record<string, unknown> = {};
  if (params) {
    if (params.search?.trim()) cleanParams.search = params.search.trim();
    if (params.page) cleanParams.page = params.page;
    if (params.limit) cleanParams.limit = params.limit;
    if (params.sort) cleanParams.sort = params.sort;
  }

  const { data } = await apiClient.get<PaginatedResponse<Specialty>>('/specialties', {
    params: cleanParams,
  });
  return data;
};

export const getAllSpecialties = async (): Promise<Specialty[]> => {
  const res = await getSpecialties({ limit: 100 });
  return res.data;
};

export const getSpecialtyById = async (id: string): Promise<Specialty> => {
  const { data } = await apiClient.get<Specialty>(`/specialties/${id}`);
  return data;
};

export const createSpecialty = async (dto: CreateSpecialtyDto): Promise<Specialty> => {
  const { data } = await apiClient.post<Specialty>('/specialties', dto);
  return data;
};

export const updateSpecialty = async (id: string, dto: UpdateSpecialtyDto): Promise<Specialty> => {
  const { data } = await apiClient.patch<Specialty>(`/specialties/${id}`, dto);
  return data;
};

export const deleteSpecialty = async (id: string): Promise<{ success: boolean; message?: string }> => {
  const { data } = await apiClient.delete(`/specialties/${id}`);
  return data;
};
