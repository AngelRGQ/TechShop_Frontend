export interface ApiResponse<T> {
  data: T;
  mensaje?: string;
  total?: number;
}
