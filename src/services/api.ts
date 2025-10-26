export const API_BASE_URL =
  (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:3000';

export const ENDPOINTS = {
  products: '/products',
  suppliers: '/suppliers',
};

export async function apiFetch<T = any>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    let detail = '';
    try {
      const data = await res.json();
      detail = data?.error || JSON.stringify(data);
    } catch {}
    throw new Error(`${res.status} ${res.statusText} ${detail}`.trim());
  }
  try {
    return (await res.json()) as T;
  } catch {
    return undefined as unknown as T;
  }
}

export function linkSupplierProduct(
  supplierId: number,
  productId: number,
  body: { price?: string; leadTimeDays?: number }
) {
  return apiFetch(`/suppliers/${supplierId}/products/${productId}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
// ... mantém o resto do arquivo

export function getProductsBySupplier(supplierId: number) {
  return apiFetch<{ supplier: { id: number; name: string }, products: any[] }>(
    `/suppliers/${supplierId}/products`
  );
}


export function unlinkSupplierProduct(supplierId: number, productId: number) {
return apiFetch(`/suppliers/${supplierId}/products/${productId}`, { method: 'DELETE' });
}


export function getSuppliersByProduct(productId: number) {
return apiFetch<{ product: { id: number; name: string }, suppliers: any[] }>(`/products/${productId}/suppliers`);
}