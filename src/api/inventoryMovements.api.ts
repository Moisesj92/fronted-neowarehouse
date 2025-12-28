import axiosInstance from "./axios.config";

export interface InventoryMovement {
  id: string;
  productId: string;
  type: "IN" | "OUT" | "ADJUSTMENT";
  quantity: number;
  reason?: string;
  createdAt: string;
  product?: {
    id: string;
    name: string;
    sku: string;
  };
}

export interface CreateInventoryMovementDto {
  productId: string;
  type: "IN" | "OUT" | "ADJUSTMENT";
  quantity: number;
  reason?: string;
}

export const inventoryMovementsApi = {
  getAll: async (): Promise<InventoryMovement[]> => {
    const response = await axiosInstance.get("/inventory-movements");
    return response.data;
  },

  create: async (
    data: CreateInventoryMovementDto
  ): Promise<InventoryMovement> => {
    const response = await axiosInstance.post("/inventory-movements", data);
    return response.data;
  },
};
