import type { Cart } from '../types/cart.types';
import { apiClient } from './apiClient';

export const getCart = (): Promise<Cart> =>
  apiClient<Cart>('/cart');

export const addToCart = (productId: number, quantity: number): Promise<Cart> =>
  apiClient<Cart>('/cart/items', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });

export const removeFromCart = (productId: number): Promise<void> =>
  apiClient<void>(`/cart/items/${productId}`, { method: 'DELETE' });
