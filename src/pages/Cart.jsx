import { useEffect, useState } from "react";
import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../services/cartService";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await getCart();
        setCart(data);
      } catch (error) {
        console.error(error);
        setError("No se pudo cargar el carrito");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      return;
    }

    try {
      const updatedCart = await updateCartItem(productId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const updatedCart = await removeCartItem(productId);
      setCart(updatedCart);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearCart = async () => {
    try {
      const updatedCart = await clearCart();
      setCart(updatedCart);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <p className="text-gray-600">Cargando carrito...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Mi carrito</h1>

        {cart.items.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <p className="text-lg text-gray-600">Tu carrito está vacío</p>

            <Link
              to="/products"
              className="mt-6 inline-block rounded-lg bg-black px-5 py-2.5 font-medium text-white transition hover:bg-gray-800"
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Productos */}
            <div className="space-y-4 lg:col-span-2">
              {cart.items.map((item) => (
                <div
                  key={item.productId}
                  className="rounded-xl bg-white p-5 shadow"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {item.productName}
                      </h2>

                      <p className="mt-1 text-gray-500">S/. {item.price}</p>

                      <p className="mt-2 font-medium text-gray-800">
                        Subtotal: S/. {item.subtotal}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      className="text-sm text-red-600 transition hover:text-red-800 cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </div>

                  {/* Cantidad */}
                  <div className="mt-5 flex items-center gap-3">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.productId, item.quantity - 1)
                      }
                      disabled={item.quantity === 1}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-lg transition hover:bg-gray-100 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      −
                    </button>

                    <span className="min-w-8 text-center font-medium">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.productId, item.quantity + 1)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-lg transition hover:bg-gray-100 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={handleClearCart}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 cursor-pointer"
              >
                Vaciar carrito
              </button>
            </div>

            {/* Resumen */}
            <div className="h-fit rounded-xl bg-white p-6 shadow">
              <h2 className="text-xl font-semibold text-gray-900">Resumen</h2>

              <div className="mt-6 flex justify-between text-gray-600">
                <span>Productos</span>
                <span>{cart.items.length}</span>
              </div>

              <div className="mt-3 flex justify-between border-t pt-4 text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>S/. {cart.total}</span>
              </div>

              <Link
                to="/checkout"
                className="mt-6 block rounded-lg bg-black px-4 py-3 text-center font-medium text-white transition hover:bg-gray-800"
              >
                Ir al checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
