export type Product = {
id?: number;
name: string;
price: string;
barcode?: string;
description?: string;
quantity?: number;
category?: string;
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