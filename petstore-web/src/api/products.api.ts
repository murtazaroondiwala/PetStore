import type { Product } from "../types/product.types";
import { apiClient } from "./apiClient";

export const getProducts = (): Promise<Product[]> =>
  apiClient<Product[]>("/products");
