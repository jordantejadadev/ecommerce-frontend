import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProductById } from "../services/productService";
import { addProductToCart } from "../services/cartService";
import { useAuth } from "../context/AuthContext";
import ProductGallery from "../components/ProductGallery";
import { toast } from "sonner";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await getProductById(productId);
      setProduct(data);
      setQuantity(1);
    } catch (error) {
      setError("No se pudo cargar el producto");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (product && next > product.stock) return product.stock;
      return next;
    });
  };

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await addProductToCart(product.id, quantity);
      toast.success("Producto agregado al carrito");
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("No se pudo agregar el producto");
      }
    } finally {
      setAdding(false);
    }
  };

  const outOfStock = product?.stock === 0;

  return (
    <div className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {loading ? (
          <div className="grid animate-pulse gap-10 lg:grid-cols-2">
            <div className="h-[450px] rounded-xl bg-gray-200">
              <div className="space-y-4">
                <div className="h-8 w-3/4 rounded bg-gray-200" />
                <div className="h-5 w-1/3 rounded bg-gray-200" />
                <div className="h-24 w-full rounded bg-gray-200" />
                <div className="h-10 w-1/3 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ) : error || !product ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-600">{error || "Producto no encontrado"}</p>
            <Link
              to="/products"
              className="mt-4 font-medium text-blue-600 hover:underline"
            >
              Volver a productos
            </Link>
          </div>
        ) : (
          <>
            <nav className="mb-6 text-sm text-gray-500">
              <Link to="/products" className="hover:text-gray-700">
                Productos
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700">{product.name}</span>
            </nav>

            <div className="grid gap-10 lg:grid-cols-2">
              <ProductGallery
                mainImage={product.imageUrl}
                images={product.images}
              />

              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>

                <p className="mt-3 text-3xl font-bold text-gray-900">
                  S/. {product.price}
                </p>

                <p
                  className={`mt-2 text-sm font-medium ${
                    outOfStock ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {outOfStock ? "Sin stock" : `${product.stock} disponibles`}
                </p>

                <p className="mt-6 leading-relaxed text-gray-600">
                  {product.description}
                </p>

                {!outOfStock && (
                  <div className="mt-8">
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      Cantidad
                    </p>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="h-10 w-10 rounded-lg border border-gray-300 text-lg font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-40"
                      >
                        −
                      </button>

                      <span className="w-10 text-center text-lg font-medium">
                        {quantity}
                      </span>

                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        className="h-10 w-10 rounded-lg border border-gray-300 text-lg font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  {outOfStock ? (
                    <button
                      disabled
                      className="w-full cursor-not-allowed rounded-lg bg-gray-300 px-4 py-3 font-medium text-gray-500"
                    >
                      Sin stock
                    </button>
                  ) : user ? (
                    <button
                      onClick={handleAddToCart}
                      disabled={adding}
                      className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {adding ? "Agregando..." : "Agregar al carrito"}
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-100 cursor-pointer"
                    >
                      Iniciar sesión para comprar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
