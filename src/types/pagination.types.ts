export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  meta?: Record<string, unknown>;
}

export interface BaseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

