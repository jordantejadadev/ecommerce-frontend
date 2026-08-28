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

  if (loading) {
    return <p>Cargando órdenes...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (orders.length === 0) {
    return <p>No tienes órdenes todavia</p>;
  }

  return (
    <div>
      <h1>Mis órdenes</h1>

      {orders.map((order) => (
        <div key={order.id}>
          <h2>Orden: {order.id}</h2>
          <p>Estado: {order.status}</p>
          <p>Total: S/. {order.total}</p>
          <p>
            Dirección: {order.address.street}, {order.address.city}, ,{" "}
            {order.address.country}
          </p>

          <h3>Productos</h3>

          {order.items.map((item) => (
            <div key={item.productId}>
              <p>{item.productName}</p>
              <p>{item.quantity} x S/. {item.unitPrice}</p>
              <p>Subtotal S/. {item.subtotal}</p>              
            </div>
          ))}
          <Link to={`/orders/${order.id}`}>Ver detalle</Link>
        </div>        
      ))}
    </div>
  );
}
