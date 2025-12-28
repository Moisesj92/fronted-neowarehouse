import axiosInstance from "./axios.config";

export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await axiosInstance.get("/categories");
    return response.data;
  },

  create: async (name: string): Promise<Category> => {
    const response = await axiosInstance.post("/categories", { name });
    return response.data;
  },

  update: async (id: string, name: string): Promise<Category> => {
    const response = await axiosInstance.put(`/categories/${id}`, { name });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/categories/${id}`);
  },
};
