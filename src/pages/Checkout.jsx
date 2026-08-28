import { useEffect, useState } from "react";
import { getCart } from "../services/cartService";
import { getAddresses } from "../services/addressService";
import { createOrder } from "../services/orderService";
import { useNavigate } from "react-router-dom";

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
        console.error(error);
        setError("No se pudo cargar el checkout");
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

      console.log("Order creada: ", order);

      navigate("/orders");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 400) {
        setError(error.response.data.message);
      } else {
        setError("No se pudo crear la orden");
      }
    }
  };

  if (loading) {
    return <p>Cargando checkout...</p>;
  }

  if (error && !cart) {
    return <p>{error}</p>;
  }

  if (!cart || cart.items.length === 0) {
    return <p>Tu carrito está vacío</p>;
  }

  return (
    <div>
      <h1>Checkout</h1>
      <h2>Productos</h2>
      {cart.items.map((item) => (
        <div key={item.productId}>
          <p>{item.productName}</p>
          <p>
            {item.quantity} x S/. {item.price}
          </p>
          <p>Subtotal S/. {item.subtotal}</p>
        </div>
      ))}

      <h2>Total: S/. {cart.total}</h2>

      {addresses.length === 0 ? (
        <p>No tienes direcciones registradas</p>
      ) : (
        addresses.map((address) => (
          <label key={address.id} style={{ display: "block" }}>
            <input
              type="radio"
              name="address"
              value={address.id}
              checked={selectedAddressId === address.id}
              onChange={(e) => setSelectedAddressId(e.target.value)}
            />
            {address.street}, {address.city}, {address.country}
          </label>
        ))
      )}

      {error && <p>{error}</p>}

      <button onClick={handleCreateOrder} disabled={addresses.length === 0}>
        Confirmar compra
      </button>
    </div>
  );
}
