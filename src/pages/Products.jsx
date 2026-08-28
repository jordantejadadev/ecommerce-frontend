import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { addProductToCart } from "../services/cartService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await addProductToCart(productId, 1);
      alert("Producto agregado al carrito");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 400) {
        alert(error.response.data.message);
      } else {
        alert("No se pudo agregar el producto");
      }
    }
  };

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Productos</h1>
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>S/. {product.price}</p>
          <p>Stock: {product.stock}</p>
          {user ? (
            <button onClick={() => handleAddToCart(product.id)}>
              Agregar al carrito
            </button>
          ) : (
            <button onClick={() => navigate("/login")}>
              Iniciar sesión para comprar
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
