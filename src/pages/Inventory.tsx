import { useState, useEffect } from "react";
import {
  Heading,
  Text,
  Button,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Input,
  Field,
  Label,
  Select,
  Textarea,
} from "../components/ui";
import { PlusIcon, InformationCircleIcon } from "@heroicons/react/20/solid";
import { inventoryMovementsApi } from "../api/inventoryMovements.api";
import { productsApi } from "../api/products.api";
import type {
  InventoryMovement,
  CreateInventoryMovementDto,
} from "../api/inventoryMovements.api";
import type { Product } from "../api/products.api";

const movementTypeLabels = {
  IN: "Entrada",
  OUT: "Salida",
  ADJUSTMENT: "Ajuste",
};

const movementTypeColors = {
  IN: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  OUT: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  ADJUSTMENT:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
};

export function Inventory() {
  const [isOpen, setIsOpen] = useState(false);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState<CreateInventoryMovementDto>({
    productId: "",
    type: "IN",
    quantity: 0,
    reason: "",
  });

  // Cargar movimientos y productos al montar el componente
  useEffect(() => {
    loadMovements();
    loadProducts();
  }, []);

  const loadMovements = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryMovementsApi.getAll();
      setMovements(data);
    } catch (err) {
      setError("Error al cargar los movimientos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const data = await productsApi.getAll();
      setProducts(data);
    } catch (err) {
      setError("Error al cargar los productos");
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.productId) {
      setError("Debes seleccionar un producto");
      return;
    }

    if (formData.type === "ADJUSTMENT" && !formData.reason?.trim()) {
      setError("Debes proporcionar una razón para el ajuste");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await inventoryMovementsApi.create(formData);
      await loadMovements();

      // Resetear formulario
      resetForm();
      setIsOpen(false);
    } catch (err) {
      setError("Error al crear el movimiento");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      productId: "",
      type: "IN",
      quantity: 0,
      reason: "",
    });
    setError(null);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "quantity") {
      const numValue = value === "" ? 0 : Number(value);
      setFormData({
        ...formData,
        [name]: numValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const requiresReason = formData.type === "ADJUSTMENT";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Movimientos de Inventario
          </Heading>
          <Text className="text-zinc-600 dark:text-zinc-400 mt-1">
            Gestión de entradas, salidas y ajustes de stock
          </Text>
        </div>
        <Button onClick={handleOpenCreate} disabled={loading}>
          <PlusIcon />
          Nuevo Movimiento
        </Button>
      </div>

      {/* Alerta informativa */}
      <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex">
          <InformationCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 shrink" />
          <Text className="text-blue-800 dark:text-blue-300">
            Los movimientos no se pueden editar ni eliminar. Si cometiste un
            error, es mejor realizar un <strong>Ajuste</strong> para corregirlo.
          </Text>
        </div>
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && movements.length === 0 ? (
        <div className="text-center py-8">
          <Text className="text-zinc-600 dark:text-zinc-400">
            Cargando movimientos...
          </Text>
        </div>
      ) : (
        /* Tabla */
        <Table className="bg-white dark:bg-zinc-900">
          <TableHead>
            <TableRow>
              <TableHeader className="font-bold text-zinc-900 dark:text-zinc-100">
                Producto
              </TableHeader>
              <TableHeader className="font-bold text-zinc-900 dark:text-zinc-100">
                SKU
              </TableHeader>
              <TableHeader className="font-bold text-zinc-900 dark:text-zinc-100">
                Tipo
              </TableHeader>
              <TableHeader className="font-bold text-zinc-900 dark:text-zinc-100 text-right">
                Cantidad
              </TableHeader>
              <TableHeader className="font-bold text-zinc-900 dark:text-zinc-100">
                Razón
              </TableHeader>
              <TableHeader className="font-bold text-zinc-900 dark:text-zinc-100">
                Fecha
              </TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {movements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Text className="text-zinc-600 dark:text-zinc-400">
                    No hay movimientos registrados
                  </Text>
                </TableCell>
              </TableRow>
            ) : (
              movements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
                    {movement.product?.name || "N/A"}
                  </TableCell>
                  <TableCell className="text-zinc-700 dark:text-zinc-300">
                    {movement.product?.sku || "N/A"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        movementTypeColors[movement.type]
                      }`}
                    >
                      {movementTypeLabels[movement.type]}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-zinc-900 dark:text-zinc-100">
                    {movement.type === "OUT" ? "-" : "+"}
                    {movement.quantity}
                  </TableCell>
                  <TableCell className="text-zinc-700 dark:text-zinc-300">
                    {movement.reason || "-"}
                  </TableCell>
                  <TableCell className="text-zinc-700 dark:text-zinc-300">
                    {new Date(movement.createdAt).toLocaleString("es-CL", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* Modal para crear movimiento */}
      <Dialog open={isOpen} onClose={handleCloseModal}>
        <DialogTitle className="text-zinc-900 dark:text-zinc-100">
          Crear Movimiento de Inventario
        </DialogTitle>
        <DialogDescription className="text-zinc-600 dark:text-zinc-400">
          Registra una entrada, salida o ajuste de inventario
        </DialogDescription>
        <DialogBody>
          <form
            onSubmit={handleSubmit}
            id="movement-form"
            className="space-y-4"
          >
            <Field>
              <Label className="text-zinc-900 dark:text-zinc-100">
                Producto
              </Label>
              {loadingProducts ? (
                <Text className="text-zinc-600 dark:text-zinc-400">
                  Cargando productos...
                </Text>
              ) : (
                <Select
                  name="productId"
                  value={formData.productId}
                  onChange={handleInputChange}
                  required
                  disabled={loading || products.length === 0}
                  className="text-zinc-900 dark:text-zinc-100"
                >
                  <option value="">Selecciona un producto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - Stock actual: {product.stock}
                    </option>
                  ))}
                </Select>
              )}
              {products.length === 0 && !loadingProducts && (
                <Text className="text-red-600 dark:text-red-400 text-sm mt-1">
                  No hay productos disponibles. Crea un producto primero.
                </Text>
              )}
            </Field>

            <Field>
              <Label className="text-zinc-900 dark:text-zinc-100">
                Tipo de movimiento
              </Label>
              <Select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="text-zinc-900 dark:text-zinc-100"
              >
                <option value="IN">Entrada</option>
                <option value="OUT">Salida</option>
                <option value="ADJUSTMENT">Ajuste</option>
              </Select>
            </Field>

            <Field>
              <Label className="text-zinc-900 dark:text-zinc-100">
                Cantidad
              </Label>
              <Input
                type="number"
                name="quantity"
                value={formData.quantity || ""}
                onChange={handleInputChange}
                placeholder="0"
                min="1"
                required
                disabled={loading}
                className="text-zinc-900 dark:text-zinc-100"
              />
            </Field>

            {requiresReason && (
              <Field>
                <Label className="text-zinc-900 dark:text-zinc-100">
                  Razón del ajuste
                </Label>
                <Textarea
                  name="reason"
                  value={formData.reason || ""}
                  onChange={handleInputChange}
                  placeholder="Describe la razón del ajuste..."
                  required
                  disabled={loading}
                  className="text-zinc-900 dark:text-zinc-100"
                  rows={3}
                />
                <Text className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                  Es obligatorio proporcionar una razón para los ajustes
                </Text>
              </Field>
            )}
          </form>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={handleCloseModal} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="movement-form"
            disabled={loading || products.length === 0}
          >
            {loading ? "Creando..." : "Crear Movimiento"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
