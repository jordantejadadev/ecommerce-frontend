import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { addProductToCart } from "../services/cartService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await addProductToCart(productId, 1);
      alert("Producto agregado al carrito");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 400) {
        alert(error.response.data.message);
      } else {
        alert("No se pudo agregar el producto");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <p className="text-gray-600">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-10 ">
        <p className="text-red-600"></p>
      </div>
    );
  }

  return (
    <div className=" flex-1 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Productos</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-56 w-full object-cover"
                onError={() => console.log("ERROR IMAGEN: ", product.imageUrl)}
                onLoad={() => console.log("IMAGEN CARGADA: ", product.imageUrl)}
              />
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-900">
                  {product.name}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {product.description}
                </p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  S/. {product.price}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Stock: {product.stock}
                </p>
                <div className="mt-5">
                  {user ? (
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="w-full rounded-lg bg-black px-4 py-2.5 font-medium text-white transition hover:bg-gray-800"
                    >
                      Agregar al carrito
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                      Iniciar sesión para comprar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
