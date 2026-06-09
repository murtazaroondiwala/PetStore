export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

export class ApiError extends Error {
  constructor(
    public readonly message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
