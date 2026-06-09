import type { Product } from "../types/api.types";
import { apiClient } from "./apiClient";

export const getProducts = (): Promise<Product[]> =>
  apiClient<Product[]>("/products");
