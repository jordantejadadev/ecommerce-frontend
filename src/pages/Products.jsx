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
    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        const data = await getProducts({ signal: controller.signal });
        setProducts(data);
      } catch (error) {
        if (error.name === "CanceledError" || error.name === "AbortError") {
          return;
        }
        console.error(error);
        setError("No se pudieron cargar los productos");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      controller.abort();
    };
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

  function ProductCardSkeleton() {
    return (
      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        <div className="h-56 w-full animate-pulse bg-gray-200" />
        <div className="space-y-3 p-5">
          <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-7 w-1/3 animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <div className=" flex-1 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Productos</h1>
        <div
          className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${loading ? "min-h-[70vh]" : ""}`}
        >
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          ) : error ? (
            <div className="flex items-center justify-start py-2">
              <p className="text-red-600 text-sm font-semibold">{error}</p>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-56 w-full object-cover"
                  onError={() =>
                    console.log("ERROR IMAGEN: ", product.imageUrl)
                  }
                  onLoad={() =>
                    console.log("IMAGEN CARGADA: ", product.imageUrl)
                  }
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
