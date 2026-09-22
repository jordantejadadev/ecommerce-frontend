import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";
import { toast } from "sonner";
import ConfirmModal from "../components/ConfirmModal";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);  

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        toast.error("No se pudieron cargar las categorias");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        const updatedCategory = await updateCategory(editingCategory.id, {
          name,
        });
        toast.success("Categoria actualizada");

        setCategories(
          categories.map((category) =>
            category.id === updatedCategory.id ? updatedCategory : category,
          ),
        );
      } else {
        const newCategory = await createCategory({ name });
        toast.success("Categoría creada");

        setCategories((category) => [...category, newCategory]);
      }

      setEditingCategory(null);
      setName("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "No se pudo guardar la categoría",
      );
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
  };

  const handleDelete = (id, name) => {
    setPendingDelete({ id, name });
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      await deleteCategory(pendingDelete.id);

      setCategories((prev) =>
        prev.filter((category) => category.id !== pendingDelete.id),
      );
      toast.success("Categoria eliminada correctamente!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "No se pudo eliminar la categoría",
      );
    } finally {
      setPendingDelete(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setName("");
  };

  if (loading) {
    return (
      <div className="flex flex-1 justify-center items-center px-6 py-10">
        <p className="text-gray-600">Cargando categorías...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">
          Administrar categorías
        </h1>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Formulario */}
          <section className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-5 text-xl font-semibold text-gray-800">
              {editingCategory ? "Editar categoría" : "Crear categoría"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="categoryName"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Nombre
                </label>

                <input
                  id="categoryName"
                  type="text"
                  placeholder="Nombre de la categoría"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
                >
                  {editingCategory ? "Guardar cambios" : "Crear categoría"}
                </button>

                {editingCategory && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 cursor-pointer"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Lista de categorías */}
          <section className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-5 text-xl font-semibold text-gray-800">
              Categorías
            </h2>

            {categories.length === 0 ? (
              <p className="text-gray-500">No hay categorías registradas.</p>
            ) : (
              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <h3 className="font-medium text-gray-800">
                      {category.name}
                    </h3>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="rounded-lg border border-blue-300 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 cursor-pointer"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => handleDelete(category.id, category.name)}
                        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <ConfirmModal
        open={pendingDelete !== null}
        title="Eliminar categoria"
        message={`¿Desea eliminar la categoria ${pendingDelete?.name}?`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        confirmText="Si, eliminar"
      />
    </div>
  );
}
