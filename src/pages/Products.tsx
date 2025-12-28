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
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { productsApi } from "../api/products.api";
import { categoriesApi } from "../api/categories.api";
import type { Product, CreateProductDto } from "../api/products.api";
import type { Category } from "../api/categories.api";

export function Products() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState<CreateProductDto>({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
  });

  // Cargar productos y categorías al montar el componente
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsApi.getAll();
      setProducts(data);
    } catch (err) {
      setError("Error al cargar los productos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (err) {
      setError("Error al cargar las categorías");
      console.error(err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoryId) {
      setError("Debes seleccionar una categoría");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEditing && editingId !== null) {
        // Actualizar producto existente
        const updatedProduct = await productsApi.update(editingId, formData);
        setProducts(
          products.map((prod) =>
            prod.id === editingId ? updatedProduct : prod
          )
        );
      } else {
        // Crear nuevo producto
        const newProduct = await productsApi.create(formData);
        setProducts([...products, newProduct]);
      }

      // Resetear formulario
      resetForm();
      setIsOpen(false);
    } catch (err) {
      setError(
        isEditing
          ? "Error al actualizar el producto"
          : "Error al crear el producto"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setIsEditing(true);
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      categoryId: product.categoryId,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await productsApi.delete(id);
      setProducts(products.filter((prod) => prod.id !== id));
    } catch (err) {
      setError("Error al eliminar el producto");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      categoryId: "",
    });
    setIsEditing(false);
    setEditingId(null);
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

    if (name === "price" || name === "stock") {
      // Permitir string vacío y convertir a número solo si hay valor
      const numValue = value === "" ? "" : Number(value);
      setFormData({
        ...formData,
        [name]: numValue,
      });
    } else {
      // Para categoryId y name, mantener como string
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Obtener nombre de categoría
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || categoryId;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Productos
          </Heading>
          <Text className="text-zinc-600 dark:text-zinc-400 mt-1">
            Gestiona el catálogo de productos
          </Text>
        </div>
        <Button onClick={handleOpenCreate} disabled={loading}>
          <PlusIcon />
          Nuevo Producto
        </Button>
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && products.length === 0 ? (
        <div className="text-center py-8">
          <Text className="text-zinc-600 dark:text-zinc-400">
            Cargando productos...
          </Text>
        </div>
      ) : (
        /* Tabla */
        <Table className="bg-white dark:bg-zinc-900">
          <TableHead>
            <TableRow>
              <TableHeader className="font-bold text-zinc-900 dark:text-zinc-100">
                Nombre
              </TableHeader>
              <TableHeader className="font-bold text-zinc-900 dark:text-zinc-100">
                Descripción
              </TableHeader>
              <TableHeader className="font-bold text-zinc-900 dark:text-zinc-100">
                Precio
              </TableHeader>
              <TableHeader className="font-bold text-zinc-900 dark:text-zinc-100">
                Stock
              </TableHeader>
              <TableHeader className="font-bold text-zinc-900 dark:text-zinc-100">
                Categoría
              </TableHeader>
              <TableHeader className="font-bold text-zinc-900 dark:text-zinc-100">
                Acciones
              </TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Text className="text-zinc-600 dark:text-zinc-400">
                    No hay productos registrados
                  </Text>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
                    {product.name}
                  </TableCell>
                  <TableCell className="text-zinc-700 dark:text-zinc-300">
                    {product.description || "-"}
                  </TableCell>
                  <TableCell className="text-zinc-900 dark:text-zinc-100">
                    ${product.price.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-zinc-900 dark:text-zinc-100">
                    {product.stock}
                  </TableCell>
                  <TableCell className="text-zinc-700 dark:text-zinc-300">
                    {product.categoryName ||
                      getCategoryName(product.categoryId)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        outline
                        onClick={() => handleEdit(product)}
                        disabled={loading}
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        outline
                        onClick={() => handleDelete(product.id)}
                        disabled={loading}
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* Modal para crear/editar producto */}
      <Dialog open={isOpen} onClose={handleCloseModal}>
        <DialogTitle className="text-zinc-900 dark:text-zinc-100">
          {isEditing ? "Editar Producto" : "Nuevo Producto"}
        </DialogTitle>
        <DialogDescription className="text-zinc-600 dark:text-zinc-400">
          {isEditing
            ? "Modifica la información del producto"
            : "Completa los datos para agregar un nuevo producto"}
        </DialogDescription>
        <DialogBody>
          <form onSubmit={handleSubmit} id="product-form" className="space-y-4">
            <Field>
              <Label className="text-zinc-900 dark:text-zinc-100">
                Nombre del producto
              </Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ej: Laptop Dell XPS 13"
                required
                disabled={loading}
                className="text-zinc-900 dark:text-zinc-100"
              />
            </Field>

            <Field>
              <Label className="text-zinc-900 dark:text-zinc-100">
                Descripción (opcional)
              </Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descripción detallada del producto..."
                disabled={loading}
                className="text-zinc-900 dark:text-zinc-100"
                rows={3}
              />
            </Field>

            <Field>
              <Label className="text-zinc-900 dark:text-zinc-100">Precio</Label>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                required
                disabled={loading}
                className="text-zinc-900 dark:text-zinc-100"
              />
            </Field>

            <Field>
              <Label className="text-zinc-900 dark:text-zinc-100">
                Categoría
              </Label>
              {loadingCategories ? (
                <Text className="text-zinc-600 dark:text-zinc-400">
                  Cargando categorías...
                </Text>
              ) : (
                <Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                  disabled={loading || categories.length === 0}
                  className="text-zinc-900 dark:text-zinc-100"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              )}
              {categories.length === 0 && !loadingCategories && (
                <Text className="text-red-600 dark:text-red-400 text-sm mt-1">
                  No hay categorías disponibles. Crea una categoría primero.
                </Text>
              )}
            </Field>
          </form>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={handleCloseModal} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="product-form"
            disabled={loading || categories.length === 0}
          >
            {loading
              ? "Guardando..."
              : isEditing
              ? "Actualizar"
              : "Crear Producto"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
