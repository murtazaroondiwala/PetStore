import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '../api/apiClient';
import { ApiError } from '../types/api.types';

const mockFetch = (body: object, status = 200) => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  }));
};

afterEach(() => vi.unstubAllGlobals());

describe('apiClient middleware', () => {
  it('returns data when success is true and response is ok', async () => {
    mockFetch({ success: true, data: { id: 1 }, error: null });

    const result = await apiClient<{ id: number }>('/test');

    expect(result).toEqual({ id: 1 });
  });

  it('throws ApiError with the error message when success is false', async () => {
    mockFetch({ success: false, data: null, error: 'Product not found.' }, 404);

    await expect(apiClient('/test')).rejects.toThrow(ApiError);
    await expect(apiClient('/test')).rejects.toThrow('Product not found.');
  });

  it('throws ApiError with status code from the response', async () => {
    mockFetch({ success: false, data: null, error: 'Not found.' }, 404);

    try {
      await apiClient('/test');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).status).toBe(404);
    }
  });

  it('falls back to a generic message when error field is null', async () => {
    mockFetch({ success: false, data: null, error: null }, 500);

    await expect(apiClient('/test')).rejects.toThrow('An unexpected error occurred.');
  });
});
