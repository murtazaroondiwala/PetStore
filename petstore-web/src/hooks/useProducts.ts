import { useEffect, useState } from 'react';
import { getProducts } from '../api/products.api';
import { ApiError, type Product } from '../types/api.types';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(err => setError(err instanceof ApiError ? err.message : 'Failed to load products.'))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}
