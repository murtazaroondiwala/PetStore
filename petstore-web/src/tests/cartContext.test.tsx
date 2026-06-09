import { renderHook, act, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as cartApi from '../api/cart.api';
import { CartProvider, useCart } from '../context/CartContext';
import { ToastProvider } from '../context/ToastContext';
import type { Cart } from '../types/api.types';

const emptyCart: Cart = { items: [], grandTotal: 0 };

const makeCart = (...items: Array<{ productId: number; productName: string; unitPrice: number; quantity: number }>): Cart => ({
  items: items.map(i => ({ ...i, subtotal: i.unitPrice * i.quantity })),
  grandTotal: items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider><CartProvider>{children}</CartProvider></ToastProvider>
);

afterEach(() => vi.restoreAllMocks());

describe('CartContext — add-to-cart merging', () => {
  it('adds a new item to the cart', async () => {
    const updatedCart = makeCart({ productId: 1, productName: 'Product A', unitPrice: 10, quantity: 2 });
    vi.spyOn(cartApi, 'getCart').mockResolvedValue(emptyCart);
    vi.spyOn(cartApi, 'addToCart').mockResolvedValue(updatedCart);

    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.cart).toEqual(emptyCart));

    await act(() => result.current.addItem(1, 2));

    expect(cartApi.addToCart).toHaveBeenCalledWith(1, 2);
    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cart.items[0].quantity).toBe(2);
  });

  it('reflects merged quantity returned from the API', async () => {
    const mergedCart = makeCart({ productId: 1, productName: 'Product A', unitPrice: 10, quantity: 5 });
    vi.spyOn(cartApi, 'getCart').mockResolvedValue(emptyCart);
    vi.spyOn(cartApi, 'addToCart').mockResolvedValue(mergedCart);

    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.cart).toEqual(emptyCart));

    await act(() => result.current.addItem(1, 5));

    expect(result.current.cart.items[0].quantity).toBe(5);
    expect(result.current.cart.grandTotal).toBe(50);
  });

  it('rejects non-positive quantity before calling the API', async () => {
    vi.spyOn(cartApi, 'getCart').mockResolvedValue(emptyCart);
    const addSpy = vi.spyOn(cartApi, 'addToCart');

    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.cart).toEqual(emptyCart));

    await act(() => result.current.addItem(1, 0));

    expect(addSpy).not.toHaveBeenCalled();
  });
});

describe('CartContext — total calculation', () => {
  it('recalculates grand total locally after item removal', async () => {
    const initialCart = makeCart(
      { productId: 1, productName: 'Product A', unitPrice: 10, quantity: 2 }, // 20
      { productId: 2, productName: 'Product B', unitPrice: 5, quantity: 3 },  // 15
    );
    vi.spyOn(cartApi, 'getCart').mockResolvedValue(initialCart);
    vi.spyOn(cartApi, 'removeFromCart').mockResolvedValue(undefined);

    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.cart.grandTotal).toBe(35));

    await act(() => result.current.removeItem(1));

    expect(result.current.cart.items).toHaveLength(1);
    expect(result.current.cart.grandTotal).toBe(15);
  });
});
