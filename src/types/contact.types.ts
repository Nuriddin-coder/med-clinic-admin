import { BaseQueryParams } from './pagination.types';

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt?: string;
}

export type ContactSortOption =
  | 'createdAt-desc'
  | 'createdAt-asc'
  | 'name-asc'
  | 'name-desc';

export interface ContactQueryParams extends BaseQueryParams {
  sort?: ContactSortOption;
}

export interface CreateContactDto {
  name: string;
  phone: string;
  email: string;
  message: string;
}
