import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById, cancelOrder } from "../services/orderService";

export default function OrderDetail() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (error) {
        console.error(error);
        setError("No se pudo cargar la orden");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  const handleCancelOrder = async () => {
    try {
      const updatedOrder = await cancelOrder(order.id);
      setOrder(updatedOrder);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 400) {
        setError(error.response.data.message);
      } else {
        setError("No se pudo cancelar la orden");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 justify-center items-center px-6 py-10 ">
        <p className="text-gray-600">Cargando orden...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 justify-center items-center px-6 py-10">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-gray-500">Orden</p>

            <h1 className="break-all text-2xl font-bold text-gray-900">
              {order.id}
            </h1>
          </div>

          <span
            className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
              order.status === "CANCELLED"
                ? "bg-red-100 text-red-700"
                : order.status === "DELIVERED"
                  ? "bg-green-100 text-green-700"
                  : order.status === "SHIPPED"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
            }`}
          >
            {order.status}
          </span>
        </div>

        <div className="space-y-6">
          {/* Dirección */}
          <section className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900">
              Dirección de envío
            </h2>

            <div className="mt-4 text-gray-600">
              <p>{order.address.street}</p>
              <p>
                {order.address.city}, {order.address.state}
              </p>
              <p>
                {order.address.postalCode} - {order.address.country}
              </p>
            </div>
          </section>

          {/* Productos */}
          <section className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900">Productos</h2>

            <div className="mt-6 divide-y">
              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-col justify-between gap-3 py-5 sm:flex-row sm:items-center"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {item.productName}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {item.quantity} × S/. {item.unitPrice}
                    </p>
                  </div>

                  <p className="font-semibold text-gray-900">
                    S/. {item.subtotal}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Resumen */}
          <section className="rounded-xl bg-white p-6 shadow">
            <div className="flex justify-between text-gray-500">
              <span>Fecha</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>

            <div className="mt-4 flex justify-between border-t pt-4">
              <span className="text-lg font-semibold text-gray-900">Total</span>

              <span className="text-2xl font-bold text-gray-900">
                S/. {order.total}
              </span>
            </div>
          </section>

          {/* Cancelar */}
          {(order.status === "PENDING" || order.status === "PAID") && (
            <button
              onClick={handleCancelOrder}
              className="w-full rounded-lg border border-red-300 bg-white px-4 py-3 font-medium text-red-600 transition hover:bg-red-50"
            >
              Cancelar orden
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
