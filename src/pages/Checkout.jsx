import { useEffect, useState } from "react";
import { getCart } from "../services/cartService";
import { getAddresses } from "../services/addressService";
import { createOrder } from "../services/orderService";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

export default function Checkout() {
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadCheckout = async () => {
      try {
        const [cartData, addressData] = await Promise.all([
          getCart(),
          getAddresses(),
        ]);
        setCart(cartData);
        setAddresses(addressData);
      } catch (error) {
        toast.error("No se pudo cargar el checkout");
      } finally {
        setLoading(false);
      }
    };

    loadCheckout();
  }, []);

  const handleCreateOrder = async () => {
    if (!selectedAddressId) {
      setError("Selecciona una dirección");
      return;
    }

    try {
      const order = await createOrder(selectedAddressId);
      toast.success("Orden creada");
      navigate("/orders");
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("No se pudo crear la orden");
      }
    }
  };

  if (loading) {
    return <p>Cargando checkout...</p>;
  }

  if (!cart || cart.items.length === 0) {
    return <p>Tu carrito está vacío</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Checkout</h1>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Productos + dirección */}
          <div className="space-y-8 lg:col-span-2">
            <section className="rounded-xl bg-white p-6 shadow">
              <h2 className="text-xl font-semibold text-gray-900">Productos</h2>

              <div className="mt-6 space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {item.productName}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {item.quantity} × S/. {item.price}
                      </p>
                    </div>

                    <p className="font-semibold text-gray-900">
                      S/. {item.subtotal}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl bg-white p-6 shadow">
              <h2 className="text-xl font-semibold text-gray-900">
                Dirección de envío
              </h2>

              <div className="mt-5 space-y-3">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`flex cursor-pointer gap-4 rounded-lg border p-4 transition ${
                      selectedAddressId === address.id
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={address.id}
                      checked={selectedAddressId === address.id}
                      onChange={(e) => setSelectedAddressId(e.target.value)}
                      className="mt-1"
                    />

                    <div>
                      <p className="font-medium text-gray-900">
                        {address.street}
                      </p>

                      <p className="text-sm text-gray-500">
                        {address.city}, {address.state}
                      </p>

                      <p className="text-sm text-gray-500">
                        {address.postalCode} - {address.country}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              {addresses.length === 0 && (
                <div className="mt-4">
                  <p className="text-gray-500">
                    No tienes direcciones registradas.
                  </p>

                  <Link
                    to="/addresses"
                    className="mt-3 inline-block rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    Agregar dirección
                  </Link>
                </div>
              )}
            </section>
          </div>

          {/* Resumen */}
          <aside className="h-fit rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900">
              Resumen de compra
            </h2>

            <div className="mt-6 flex justify-between text-gray-600">
              <span>Productos</span>
              <span>{cart.items.length}</span>
            </div>

            <div className="mt-4 flex justify-between border-t pt-4 text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>S/. {cart.total}</span>
            </div>

            <button
              onClick={handleCreateOrder}
              disabled={!selectedAddressId}
              className="mt-6 w-full rounded-lg bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 cursor-pointer"
            >
              Confirmar compra
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
