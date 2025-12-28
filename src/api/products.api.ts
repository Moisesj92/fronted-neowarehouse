import axiosInstance from "./axios.config";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: string;
  categoryName?: string;
  createdAt: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
}

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await axiosInstance.get("/products");
    return response.data;
  },

  create: async (product: CreateProductDto): Promise<Product> => {
    const response = await axiosInstance.post("/products", product);
    return response.data;
  },

  update: async (id: string, product: UpdateProductDto): Promise<Product> => {
    const response = await axiosInstance.put(`/products/${id}`, product);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/products/${id}`);
  },
};
