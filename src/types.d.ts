export type Product = {
  id: number | string;
  name: string;
  barcode: string;
  description: string;
  price: number | string; // 👈 mude pra union
  quantity: number;
  category: string;
  expiry?: string;
  imageUrl?: string;
  createdAt?: string;
};



export type Supplier = {
id?: number;
name: string;
cnpj?: string;
address?: string;
phone?: string;
email?: string;
mainContact?: string;
createdAt?: string;
};