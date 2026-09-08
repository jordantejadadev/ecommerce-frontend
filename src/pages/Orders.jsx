import { useEffect, useState } from "react";
import { getOrders } from "../services/orderService";
import { Link } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar las órdenes");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <p className="text-gray-600">Cargando ordenes...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <p className="text-gray-600">No tienes órdenes todavia</p>
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Mis órdenes</h1>

        {orders.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <p className="text-gray-600">No tienes órdenes todavía</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="rounded-xl bg-white p-6 shadow">
                <div className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm text-gray-500">Orden</p>
                    <h2 className="break-all font-semibold text-gray-900">
                      {order.id}
                    </h2>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${order.status === "CANCELLED" ? "bg-red-100 text-red-700" : order.status === "DELIVERED" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between gap-4"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.productName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x S/. {item.unitPrice}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900">
                        S/. {item.subtotal}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col justify-between gap-4 border-t pt-5 sm:flex-row sm:items-center">
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-bold text-gray-900">
                      Total: S/. {order.total}
                    </p>
                    <Link
                      to={`/orders/${order.id}`}
                      className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                      Ver detalle
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
