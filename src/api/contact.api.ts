import { apiClient } from './client';
import {
  ContactMessage,
  CreateContactDto,
  ContactQueryParams,
} from '@/types/contact.types';
import { PaginatedResponse } from '@/types/pagination.types';

export const getContacts = async (
  params?: ContactQueryParams
): Promise<PaginatedResponse<ContactMessage>> => {
  const cleanParams: Record<string, unknown> = {};
  if (params) {
    if (params.search?.trim()) cleanParams.search = params.search.trim();
    if (params.sort) cleanParams.sort = params.sort;
    if (params.page) cleanParams.page = params.page;
    if (params.limit) cleanParams.limit = params.limit;
  }

  const { data } = await apiClient.get<PaginatedResponse<ContactMessage>>('/contact', {
    params: cleanParams,
  });
  return data;
};

export const getContactById = async (id: string): Promise<ContactMessage> => {
  const { data } = await apiClient.get<ContactMessage>(`/contact/${id}`);
  return data;
};

export const createContact = async (dto: CreateContactDto): Promise<ContactMessage> => {
  const { data } = await apiClient.post<ContactMessage>('/contact', dto);
  return data;
};

export const deleteContact = async (id: string): Promise<{ success: boolean; message?: string }> => {
  const { data } = await apiClient.delete(`/contact/${id}`);
  return data;
};
