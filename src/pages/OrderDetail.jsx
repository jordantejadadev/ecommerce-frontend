import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, cancelOrder } from "../services/orderService";

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();

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
    return <p>Cargando orden...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Detalle de orden</h1>
      <p>ID: {order.id}</p>
      <p>Estado: {order.status}</p>
      {(order.status === "PENDING" || order.status === "PAID") && (
        <button onClick={handleCancelOrder}>Cancelar orden</button>
      )}
      <h2>Dirección de envío</h2>
      <p>{order.address.street}</p>
      <p>
        {order.address.city}, {order.address.state}
      </p>
      <p>
        {order.address.postalCode} - {order.address.country}
      </p>

      <h2>Productos</h2>

      {order.items.map((item) => (
        <div key={item.productId}>
          <h3>{item.productName}</h3>
          <p>Precio unitario: S/. {item.unitPrice}</p>
          <p>Cantidad: {item.quantity}</p>
          <p>Subtotal: S/. {item.subtotal}</p>
        </div>
      ))}

      <h2>Total: S/. {order.total}</h2>
      <p>Fecha: {order.createdAt}</p>
    </div>
  );
}
