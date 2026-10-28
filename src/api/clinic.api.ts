import { apiClient } from './client';
import { ClinicInfo, UpdateClinicDto } from '@/types/clinic.types';

export const getClinicInfo = async (): Promise<ClinicInfo> => {
  const { data } = await apiClient.get<ClinicInfo>('/clinic');
  return data;
};

export const patchClinicInfo = async (dto: UpdateClinicDto): Promise<ClinicInfo> => {
  const { data } = await apiClient.patch<ClinicInfo>('/clinic', dto);
  return data;
};

export const updateClinicInfo = async (dto: UpdateClinicDto): Promise<ClinicInfo> => {
  const { data } = await apiClient.put<ClinicInfo>('/clinic', dto);
  return data;
};

