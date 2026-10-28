import { BaseQueryParams } from './pagination.types';

export interface MedicalService {
  id: string;
  name: string;
  description: string;
  specialtyId: string;
  durationMinutes: number;
  price: number;
}

export type ServiceSortOption =
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'duration-asc'
  | 'duration-desc';

export interface ServiceQueryParams extends BaseQueryParams {
  specialtyId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: ServiceSortOption;
}

export interface CreateServiceDto {
  id?: string;
  name: string;
  description: string;
  specialtyId: string;
  durationMinutes: number;
  price: number;
}

export interface UpdateServiceDto {
  name?: string;
  description?: string;
  specialtyId?: string;
  durationMinutes?: number;
  price?: number;
}
