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
    return <p>Cargando carrito...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Mi carrito</h1>

      {cart.items.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <>
          {cart.items.map((item) => (
            <div key={item.productId}>
              <h2>{item.productName}</h2>
              <p>Precio: S/. {item.price}</p>
              <div>
                <button
                  onClick={() =>
                    handleUpdateQuantity(item.productId, item.quantity - 1)
                  }
                  disabled={item.quantity === 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    handleUpdateQuantity(item.productId, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>

              <p>Subtotal: S/. {item.subtotal}</p>
              <button onClick={() => handleRemoveItem(item.productId)}>
                Eliminar
              </button>
            </div>
          ))}
          <h2>Total: S/. {cart.total}</h2>
          <Link to="/checkout">Ir al checkout</Link>
          <button onClick={() => handleClearCart()}>Vaciar carrito</button>          
        </>
      )}
    </div>
  );
}
