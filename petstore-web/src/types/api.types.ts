import type { components } from "./api.generated";

export type Product = components["schemas"]["ProductDto"];
export type Cart = components["schemas"]["CartDto"];
export type CartItem = components["schemas"]["CartItemDto"];
export type ApiResponse<T> = { success: boolean; data: T | null; error: string | null };

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}
