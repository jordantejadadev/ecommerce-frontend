import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from "../services/productService";
import { getCategories } from "../services/categoryService";
import { toast } from "sonner";
import axios from "axios";
import ConfirmModal from "../components/ConfirmModal";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    first: true,
    last: false,
  });
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 4;

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    categoryId: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      setIsFetching(true);

      try {
        setError("");

        if (categories.length === 0) {
          const categoriesData = await getCategories({
            signal: controller.signal,
          });
          setCategories(categoriesData);
        }

        const productsData = await getProducts({
          page,
          limit,
          signal: controller.signal,
        });
        setProducts(productsData.content);
        setPagination({
          totalPages: productsData.totalPages,
          first: productsData.first,
          last: productsData.last,
        });
      } catch (error) {
        if (!error.name === "AbortError" && !axios.isCancel(error)) {
          setError("No se pudieron cargar los datos");
          toast.error("No se pudieron cargar los datos");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setIsFetching(false);
        }
      }
    };

    loadData();

    return () => controller.abort();
  }, [page]);

  const handlePrev = () => {
    if (!pagination.first && !isFetching) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (!pagination.last && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      imageUrl: "",
      categoryId: "",
    });

    setEditingId(null);
    setImageFile(null);
    setImageFiles([]);
    setExistingImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = form.imageUrl;

      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadProductImage(imageFile);
      }

      // Sube todas las imágenes nuevas de la vitrina, en paralelo
      const newImageUrls = await Promise.all(
        imageFiles.map((file) => uploadProductImage(file)),
      );

      setUploading(false);

      const productData = {
        ...form,
        imageUrl,
        images: [...existingImages, ...newImageUrls],
        price: Number(form.price),
        stock: Number(form.stock),
      };

      if (editingId) {
        const updatedProduct = await updateProduct(editingId, productData);
        setProducts((prev) =>
          prev.map((product) =>
            product.id === editingId ? updatedProduct : product,
          ),
        );
        toast.success("Producto actualizaddo correctamente");
      } else {
        const newProduct = await createProduct(productData);
        setProducts((prev) => [...prev, newProduct]);
        toast.success("Producto creado correctamente");
      }

      resetForm();
    } catch (error) {
      setUploading(false);
      toast.error(
        error.response?.data?.message || "No se pudo guardar el producto",
      );
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl || "",
      categoryId: product.categoryId || "",
    });

    setExistingImages(product.images || []);
    setImageFiles([]);
  };

  const handleDelete = (id) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await deleteProduct(pendingDeleteId);
      setProducts((prev) =>
        prev.filter((product) => product.id !== pendingDeleteId),
      );
      toast.success("Producto eliminado correctamente");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "No se pudo eliminar el producto",
      );
    } finally {
      setPendingDeleteId(null);
    }
  };
  return (
    <div className="flex-1 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">
          Administración de productos
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Formulario */}
          <section className="rounded-xl bg-white p-6 shadow-md lg:col-span-1">
            <h2 className="mb-5 text-xl font-semibold text-gray-800">
              {editingId ? "Editar producto" : "Nuevo producto"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Nombre
                </label>

                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Descripción
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="price"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Precio
                  </label>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="stock"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Stock
                  </label>

                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="imageFile"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Imagen del producto
                </label>

                <input
                  id="imageFile"
                  name="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

                {(imageFile || form.imageUrl) && (
                  <img
                    src={
                      imageFile ? URL.createObjectURL(imageFile) : form.imageUrl
                    }
                    alt="Vista previa"
                    className="mt-2 h-24 w-24 rounded-lg object-cover"
                  />
                )}
              </div>

              <div>
                <label
                  htmlFor="imageFiles"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Imágenes adicionales (vitrina)
                </label>

                <input
                  id="imageFiles"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setImageFiles(Array.from(e.target.files))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

                <div className="mt-2 flex flex-wrap gap-2">
                  {existingImages.map((url, i) => (
                    <div key={i} className="relative">
                      <img
                        src={url}
                        alt=""
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setExistingImages((prev) =>
                            prev.filter((_, idx) => idx !== i),
                          )
                        }
                        className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {imageFiles.map((file, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="h-16 w-16 rounded-lg object-cover opacity-70"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="categoryId"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Categoría
                </label>

                <select
                  id="categoryId"
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">Selecciona una categoría</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading
                    ? "Subiendo imagen..."
                    : editingId
                      ? "Actualizar"
                      : "Crear"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 cursor-pointer"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Lista de productos */}
          <section className="flex flex-col rounded-xl bg-white p-6 shadow-md lg:col-span-2 min-h-[520px]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Productos</h2>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                {products.length} productos
              </span>
            </div>

            {loading ? (
              <>
                <div className="flex-1 space-y-4 animate-pulse">
                  <div className="flex-1 space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="h-16 w-16 shrink-0 rounded-lg bg-gray-200" />

                          <div className="space-y-2">
                            <div className="h-5 w-40 rounded bg-gray-200" />

                            <div className="h-4 w-24 rounded bg-gray-200" />

                            <div className="flex gap-3">
                              <div className="h-4 w-16 rounded bg-gray-200" />
                              <div className="h-4 w-16 rounded bg-gray-200" />
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <div className="h-9 w-16 rounded-lg bg-gray-200" />
                          <div className="h-9 w-16 rounded-lg bg-gray-200" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-6 flex items-center justify-center gap-4">
                    <div className="h-9 w-9 rounded-lg bg-gray-200" />

                    <div className="h-9 w-9 rounded-lg bg-gray-200" />
                    <div className="h-9 w-9 rounded-lg bg-gray-900" />
                    <div className="h-9 w-9 rounded-lg bg-gray-200" />

                    <div className="h-9 w-9 rounded-lg bg-gray-200" />
                  </div>
                </div>
              </>
            ) : products && products.length > 0 ? (
              <>
                <div className="flex-1 space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-500">
                            Sin imagen
                          </div>
                        )}

                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-gray-800">
                            {product.name}
                          </h3>

                          <p className="text-sm text-gray-500">
                            {categories.find(
                              (category) => category.id === product.categoryId,
                            )?.name || "Sin categoría"}
                          </p>

                          <div className="mt-1 flex flex-wrap gap-3 text-sm">
                            <span className="font-medium text-gray-800">
                              S/ {product.price}
                            </span>

                            <span className="text-gray-500">
                              Stock: {product.stock}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="rounded-lg border border-blue-300 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 cursor-pointer"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => handleDelete(product.id)}
                          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {!loading && !error && pagination.totalPages > 1 && (
                  <div className="mt-auto pt-6 flex items-center justify-center gap-4">
                    <button
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={handlePrev}
                      disabled={pagination.first || isFetching}
                    >
                      Anterior
                    </button>
                    <span className="text-sm font-medium text-gray-700">{`Pagina ${page} de ${pagination.totalPages}`}</span>
                    <button
                      disabled={pagination.last || isFetching}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={handleNext}
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500">No hay productos registradossss.</p>
            )}
          </section>
        </div>
      </div>

      <ConfirmModal
        open={pendingDeleteId !== null}
        title="Eliminar Producto"
        message="¿Seguro que deseas eliminar este producto?"
        confirmText="Si, eliminar"
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
