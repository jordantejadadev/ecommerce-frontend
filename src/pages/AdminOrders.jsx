import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAllOrders, updateOrderStatus } from "../services/adminOrderService";

const NEXT_STATUS = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

const STATUS_STYLES = {
  PENDING: "bg-gray-100 text-gray-700",
  PAID: "bg-yellow-100 text-yellow-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      toast.error("No se pudieron cargar las órdenes");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? updatedOrder : order)),
      );
      toast.success("Estado actualizado correctamente");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "No se pudo actualizar el estado",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">
          Administrar órdenes
        </h1>

        <section className="rounded-xl bg-white p-6 shadow-md">
          {loading ? (
            <p className="text-gray-500">Cargando órdenes</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-500">No hay órdenes registradas</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <p className="break-all font-medium text-gray-800">
                        {order.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.userName} - {order.userEmail}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${STATUS_STYLES[order.status]}`}
                      >
                        {order.status}
                      </span>
                      <p className="font-semibold text-gray-900">
                        S/. {order.total}
                      </p>
                    </div>
                  </div>

                  {NEXT_STATUS[order.status].length > 0 && (
                    <div className="mt-3 flex gap-2 border-t pt-3">
                      {NEXT_STATUS[order.status].map((nextStatus) => (
                        <button
                          key={nextStatus}
                          disabled={updatingId === order.id}
                          onClick={() =>
                            handleStatusChange(order.id, nextStatus)
                          }
                          className="rounded-lg border border-blue-300 px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updatingId === order.id
                            ? "Actualizando..."
                            : `Marcar como ${nextStatus}`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
