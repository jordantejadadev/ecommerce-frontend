import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  deleteProduct,
} from "../services/productService";
import { getCategories } from "../services/categoryService";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    categoryId: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const newProduct = await createProduct({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });

      setProducts([...products, newProduct]);

      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        imageUrl: "",
        categoryId: "",
      });
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "No se pudo crear el producto");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);

      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "No se pudo desactivar el producto",
      );
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h1>Administrar productos</h1>

      {error && <p>{error}</p>}

      <h2>Crear producto</h2>

      <form onSubmit={handleCreate}>
        <input
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
        />

        <input
          name="price"
          type="number"
          placeholder="Precio"
          value={form.price}
          onChange={handleChange}
        />

        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
        />

        <input
          name="imageUrl"
          placeholder="URL de imagen"
          value={form.imageUrl}
          onChange={handleChange}
        />

        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
        >
          <option value="">Seleccionar categoría</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <button type="submit">Crear producto</button>
      </form>

      <h2>Productos</h2>

      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>

          <p>S/. {product.price}</p>

          <p>Stock: {product.stock}</p>

          <button onClick={() => handleDelete(product.id)}>Desactivar</button>

          <hr />
        </div>
      ))}
    </div>
  );
}
