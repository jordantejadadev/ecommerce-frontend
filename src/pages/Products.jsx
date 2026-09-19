import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { addProductToCart } from "../services/cartService";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false); // Estado para transiciones suaves
  const [error, setError] = useState("");

  // Estados para la paginación
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    first: true,
    last: false,
  });
  const limit = 4; // Productos por página

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        setError("");

        // Skeletons solo en la carga inicial; para cambios de página usamos isFetching
        if (products.length === 0) {
          setLoading(true);
        } else {
          setIsFetching(true);
        }

        const response = await getProducts({
          page,
          limit,
          signal: controller.signal,
        });

        setProducts(response.content || response);
        setPagination({
          totalPages: response.totalPages,
          first: response.first,
          last: response.last,
        });
      } catch (error) {
        if (error.name === "CanceledError" || error.name === "AbortError") {
          return;
        }
        console.error(error);
        setError("No se pudieron cargar los productos");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setIsFetching(false);
        }
      }
    };

    loadProducts();

    return () => {
      controller.abort();
    };
  }, [page]);

  const handlePrev = () => {
    if (!pagination.first && !isFetching) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (!pagination.last && !isFetching) setPage((prev) => prev + 1);
  };

  const handleAddToCart = async (productId) => {
    try {
      await addProductToCart(productId, 1);
      toast.success("Producto agregado al carrito");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("No se pudo agregar el producto");
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
    <div className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Productos</h1>

        {/* Aplicamos opacidad suave cuando isFetching es true */}
        <div
          className={`grid gap-6 transition-opacity duration-200 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${
            isFetching ? "pointer-events-none opacity-50" : "opacity-100"
          }`}
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          ) : error ? (
            <div className="flex items-center justify-start py-2">
              <p className="text-sm font-semibold text-red-600">{error}</p>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Link to={`/products/${product.id}`}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-56 w-full object-cover"
                  />
                </Link>
                <div className="p-5">
                  <Link to={`/products/${product.id}`}>
                    <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                      {product.name}
                    </h2>
                  </Link>
                  <p className="mt-2 text-sm text-gray-600 truncate">
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
                        className="w-full rounded-lg bg-black px-4 py-2.5 font-medium text-white transition hover:bg-gray-800 cursor-pointer"
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

        {!loading && !error && pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={handlePrev}
              disabled={pagination.first || isFetching}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm font-medium text-gray-700">
              Página {page} de {pagination.totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={pagination.last || isFetching}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
