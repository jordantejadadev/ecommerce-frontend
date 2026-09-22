import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, cancelOrder } from "../services/orderService";
import { toast } from "sonner";
import ConfirmModal from "../components/ConfirmModal";

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (error) {
        toast.error("No se pudo cargar la orden");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  const handleCancelOrder = () => {
    setShowCancelModal(true);
  };

  const confirmCancelOrder = async () => {
    try {
      setShowCancelModal(false);
      const updatedOrder = await cancelOrder(order.id);
      setOrder(updatedOrder);
      toast.success("Orden cancelada");
      navigate("/orders");
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error("No se pudo cancelar la orden");
      }
    }
  };

  return (
    <div className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        {loading ? (
          <div className="animate-pulse space-y-6">
            {/* Header con id y estado */}
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-16 rounded bg-gray-200" />
                <div className="h-6 w-64 rounded bg-gray-200" />
              </div>
              <div className="h-8 w-24 rounded-full bg-gray-200" />
            </div>

            {/* Dirección */}
            <div className="rounded-xl bg-white p-6 shadow">
              <div className="h-6 w-40 rounded bg-gray-200" />
              <div className="mt-4 space-y-2">
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-2/3 rounded bg-gray-200" />
                <div className="h-4 w-1/2 rounded bg-gray-200" />
              </div>
            </div>

            {/* Productos */}
            <div className="rounded-xl bg-white p-6 shadow">
              <div className="h-6 w-32 rounded bg-gray-200" />
              <div className="mt-6 space-y-5">
                <div className="h-14 w-full rounded bg-gray-200" />
                <div className="h-14 w-full rounded bg-gray-200" />
              </div>
            </div>

            {/* Resume */}
            <div className="rounded-xl bg-white p-6 shadow">
              <div className="h-16 w-full rounded bg-gray-200" />
            </div>

            {/* Botón cancelar */}
            <div className="h-14 w-full rounded-lg bg-gray-200" />
          </div>
        ) : !order ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-600">No se pudo cargar la orden</p>
          </div>
        ) : (
          <>
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

              <section className="rounded-xl bg-white p-6 shadow">
                <h2 className="text-xl font-semibold text-gray-900">
                  Productos
                </h2>

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

              <section className="rounded-xl bg-white p-6 shadow">
                <div className="flex justify-between text-gray-500">
                  <span>Fecha</span>
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                </div>

                <div className="mt-4 flex justify-between border-t pt-4">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    S/. {order.total}
                  </span>
                </div>
              </section>

              {(order.status === "PENDING" || order.status === "PAID") && (
                <button
                  onClick={handleCancelOrder}
                  className="w-full rounded-lg border border-red-300 bg-white px-4 py-3 font-medium text-red-600 transition hover:bg-red-50 cursor-pointer"
                >
                  Cancelar orden
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        open={showCancelModal}
        title="Cancelar orden"
        message="¿Seguro que deseas cancelar esta orden?"
        confirmText="Sí, cancelar"
        onConfirm={confirmCancelOrder}
        onCancel={() => setShowCancelModal(false)}
      />
    </div>
  );
}
