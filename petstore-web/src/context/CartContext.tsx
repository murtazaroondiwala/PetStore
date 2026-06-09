import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { addToCart, getCart, removeFromCart } from '../api/cart.api';
import { ApiError } from '../types/api.types';
import type { Cart } from '../types/cart.types';
import { useToast } from './ToastContext';

interface CartContextValue {
  cart: Cart;
  loading: boolean;
  addItem: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
}

const emptyCart: Cart = { items: [], grandTotal: 0 };

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(emptyCart);
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    getCart().then(setCart).catch(() => showError('Failed to load cart.'));
  }, []);

  const addItem = useCallback(async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      showError('Quantity must be greater than zero.');
      return;
    }
    setLoading(true);
    try {
      const updated = await addToCart(productId, quantity);
      setCart(updated);
      showSuccess('Item added to cart.');
    } catch (err) {
      showError(err instanceof ApiError ? err.message : 'Failed to add item.');
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);

  const removeItem = useCallback(async (productId: number) => {
    setLoading(true);
    try {
      await removeFromCart(productId);
      setCart(prev => {
        const items = prev.items.filter(i => i.productId !== productId);
        return { items, grandTotal: items.reduce((sum, i) => sum + i.subtotal, 0) };
      });
      showSuccess('Item removed from cart.');
    } catch (err) {
      showError(err instanceof ApiError ? err.message : 'Failed to remove item.');
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);

  return (
    <CartContext.Provider value={{ cart, loading, addItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
