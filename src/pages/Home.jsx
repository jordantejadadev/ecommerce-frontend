import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService";
import HeroCarousel from "../components/HeroCarousel";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        setError("");
        setLoading(true);

        const data = await getProducts({page: 0, limit: 4, signal: controller.signal});        

        setFeatured(Array.isArray(data.content) ? data.content : []);
      } catch (error) {

        if(error.name === "CanceledError" || error.name === "AbortError") {
          return;
        }

        setError(
          error?.response?.data?.message ||
            "Ocurrió un error al cargar productos",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      controller.abort();
    }
  }, []);

  return (
    <div>
      {/* HERO */}     
      <HeroCarousel />

      {/* OFERTAS */}
      <section className="bg-amber-50 px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Ofertas del momento
            </h2>
            <Link
              to="/products"
              className="text-sm font-medium text-amber-700 hover:underline"
            >
              Ver todas
            </Link>
          </div>

          <div className="rounded-xl bg-amber-100 p-8 text-center sm:text-left">
            <p className="text-lg font-semibold text-amber-900">
              Envío gratis en compras mayores a S/100
            </p>
            <p className="mt-1 text-sm text-amber-800">
              Válido por tiempo limitado en todo el catálogo
            </p>
          </div>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">Destacados</h2>
          {loading ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border border-gray-200"
                >
                  <div className="h-40 w-full animate-pulse bg-gray-200" />
                  <div className="space-y-2 p-3">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex items-center justify-start  py-2 ">
              <p className="text-red-600 text-sm font-semibold">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {featured.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group overflow-hidden rounded-xl border border-gray-200 transition hover:shadow-md"
                >
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-40 w-full object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                      Sin imagen
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="truncate text-sm font-medium text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-sm font-semibold text-gray-900">
                      S/ {product.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
