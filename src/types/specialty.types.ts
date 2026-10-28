import { BaseQueryParams } from './pagination.types';

export interface Specialty {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export type SpecialtySortOption = 'name-asc' | 'name-desc';

export interface SpecialtyQueryParams extends BaseQueryParams {
  sort?: SpecialtySortOption;
}

export interface CreateSpecialtyDto {
  id?: string;
  name: string;
  description: string;
  icon: string;
}

export interface UpdateSpecialtyDto {
  name?: string;
  description?: string;
  icon?: string;
}
