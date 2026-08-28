import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar las categorias");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingCategory) {
        const updatedCategory = await updateCategory(editingCategory.id, {
          name,
        });

        setCategories(
          categories.map((category) =>
            category.id === updatedCategory.id ? updatedCategory : category,
          ),
        );
      } else {
        const newCategory = await createCategory({ name });

        setCategories((category) => [...category, newCategory]);
      }

      setEditingCategory(null);
      setName("");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "No se pudo guardar la categoría",
      );
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setError("");
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter((category) => category.id != id));
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "No se pudo eliminar la categoría",
      );
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setName("");
    setError("");
  };

  if (loading) {
    return <p>Cargando categorías...</p>;
  }

  return (
    <div>
      <h1>Administrar categorías</h1>

      {error && <p>{error}</p>}

      <h2>{editingCategory ? "Editar categoría" : "Crear categoría"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button type="submit">
          {editingCategory ? "Guardar cambios" : "Crear categoría"}
        </button>

        {editingCategory && (
          <button type="button" onClick={handleCancelEdit}>
            Cancelar
          </button>
        )}
      </form>

      <h2>Categorías</h2>

      {categories.map((category) => (
        <div key={category.id}>
          <h3>{category.name}</h3>
          <button onClick={() => handleEdit(category)}>Editar</button>
          <button onClick={() => handleDelete(category.id)}>Eliminar</button>
          <hr />
        </div>
      ))}
    </div>
  );
}
