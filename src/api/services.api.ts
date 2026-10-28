import { apiClient } from './client';
import {
  MedicalService,
  CreateServiceDto,
  UpdateServiceDto,
  ServiceQueryParams,
} from '@/types/service.types';
import { PaginatedResponse } from '@/types/pagination.types';

export const getServices = async (
  params?: ServiceQueryParams
): Promise<PaginatedResponse<MedicalService>> => {
  const cleanParams: Record<string, unknown> = {};
  if (params) {
    if (params.search?.trim()) cleanParams.search = params.search.trim();
    if (params.specialtyId && params.specialtyId !== 'ALL') {
      cleanParams.specialtyId = params.specialtyId;
    }
    if (params.minPrice !== undefined && params.minPrice > 0) {
      cleanParams.minPrice = params.minPrice;
    }
    if (params.maxPrice !== undefined && params.maxPrice > 0) {
      cleanParams.maxPrice = params.maxPrice;
    }
    if (params.sort) cleanParams.sort = params.sort;
    if (params.page) cleanParams.page = params.page;
    if (params.limit) cleanParams.limit = params.limit;
  }

  const { data } = await apiClient.get<PaginatedResponse<MedicalService>>('/services', {
    params: cleanParams,
  });
  return data;
};

export const getAllServices = async (): Promise<MedicalService[]> => {
  const res = await getServices({ limit: 100 });
  return res.data;
};

export const getServiceById = async (id: string): Promise<MedicalService> => {
  const { data } = await apiClient.get<MedicalService>(`/services/${id}`);
  return data;
};

export const createService = async (dto: CreateServiceDto): Promise<MedicalService> => {
  const { data } = await apiClient.post<MedicalService>('/services', dto);
  return data;
};

export const updateService = async (id: string, dto: UpdateServiceDto): Promise<MedicalService> => {
  const { data } = await apiClient.patch<MedicalService>(`/services/${id}`, dto);
  return data;
};

export const deleteService = async (id: string): Promise<{ success: boolean; message?: string }> => {
  const { data } = await apiClient.delete(`/services/${id}`);
  return data;
};
