export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type AppResponse<T> = {
  data: T;
  pagination: Pagination;
};
