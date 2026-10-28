import { apiClient } from './client';
import { AuthUser, LoginResponse } from '@/types/auth.types';

export interface LoginDto {
  username: string;
  password: string;
}

export const loginApi = async (dto: LoginDto): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', dto);
  return data;
};

export const registerApi = async (dto: LoginDto): Promise<{ message: string; user: AuthUser }> => {
  const { data } = await apiClient.post('/auth/register', dto);
  return data;
};

