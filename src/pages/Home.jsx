import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService";
import HeroCarousel from "../components/HeroCarousel";

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getProducts()
      .then((data) => setFeatured(data.slice(0, 4)))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <div>
      {/* HERO */}
      {/* <section className="bg-gray-900 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-24">
          <p className="text-sm font-medium text-blue-400">Nueva temporada</p>
          <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
            Todo lo que buscas, a un clic de distancia
          </h1>
          <p className="max-w-md text-gray-300">
            Explora nuestro catálogo y encuentra productos pensados para ti, con
            envíos rápidos a todo el país
          </p>
          <Link
            to="/products"
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Ver productos
          </Link>
        </div>
      </section> */}
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
          {featured.length === 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-xl bg-gray-200"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {featured.map((product) => (
                <Link
                  key={product.id}
                  to="/products"
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
