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
} from "../components/ui";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { categoriesApi } from "../api/categories.api";
import type { Category } from "../api/categories.api";

export function Categories() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar categorías al montar el componente
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (err) {
      setError("Error al cargar las categorías");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      if (isEditing && editingId !== null) {
        // Actualizar categoría existente
        const updatedCategory = await categoriesApi.update(
          editingId,
          categoryName
        );
        setCategories(
          categories.map((cat) =>
            cat.id === editingId ? updatedCategory : cat
          )
        );
      } else {
        // Crear nueva categoría
        const newCategory = await categoriesApi.create(categoryName);
        setCategories([...categories, newCategory]);
      }

      // Resetear formulario
      setCategoryName("");
      setIsOpen(false);
      setIsEditing(false);
      setEditingId(null);
    } catch (err) {
      setError(
        isEditing
          ? "Error al actualizar la categoría"
          : "Error al crear la categoría"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setIsEditing(true);
    setEditingId(category.id);
    setCategoryName(category.name);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta categoría?")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await categoriesApi.delete(id);
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (err) {
      setError("Error al eliminar la categoría");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setIsEditing(false);
    setEditingId(null);
    setCategoryName("");
    setError(null);
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setCategoryName("");
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading className="text-3xl font-bold text-zinc-900">
            Categorías
          </Heading>
          <Text className="text-zinc-600 mt-1">
            Gestiona las categorías de productos
          </Text>
        </div>
        <Button onClick={handleOpenCreate} disabled={loading}>
          <PlusIcon />
          Nueva Categoría
        </Button>
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-800">{error}</div>
      )}

      {/* Loading state */}
      {loading && categories.length === 0 ? (
        <div className="text-center py-8">
          <Text className="text-zinc-600">Cargando categorías...</Text>
        </div>
      ) : (
        /* Tabla */
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader className="font-bold text-zinc-900">ID</TableHeader>
              <TableHeader className="font-bold text-zinc-900">
                Nombre
              </TableHeader>
              <TableHeader className="font-bold text-zinc-900">
                Fecha de Creación
              </TableHeader>
              <TableHeader className="font-bold text-zinc-900">
                Acciones
              </TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <Text className="text-zinc-600">
                    No hay categorías registradas
                  </Text>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="text-zinc-900">{category.id}</TableCell>
                  <TableCell className="font-medium text-zinc-900">
                    {category.name}
                  </TableCell>
                  <TableCell className="text-zinc-700">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        outline
                        onClick={() => handleEdit(category)}
                        disabled={loading}
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        outline
                        onClick={() => handleDelete(category.id)}
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

      {/* Modal para crear/editar categoría */}
      <Dialog open={isOpen} onClose={handleCloseModal}>
        <DialogTitle className="text-zinc-900">
          {isEditing ? "Editar Categoría" : "Nueva Categoría"}
        </DialogTitle>
        <DialogDescription className="text-zinc-600">
          {isEditing
            ? "Modifica el nombre de la categoría"
            : "Crea una nueva categoría para organizar tus productos"}
        </DialogDescription>
        <DialogBody>
          <form onSubmit={handleSubmit} id="category-form">
            <Field>
              <Label className="text-zinc-900">Nombre de la categoría</Label>
              <Input
                name="name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Ej: Electrónica, Ropa, Alimentos..."
                required
                disabled={loading}
                className="text-zinc-900"
              />
            </Field>
          </form>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={handleCloseModal} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" form="category-form" disabled={loading}>
            {loading
              ? "Guardando..."
              : isEditing
              ? "Actualizar"
              : "Crear Categoría"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
