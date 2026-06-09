export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}
