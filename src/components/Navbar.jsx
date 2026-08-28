import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav>
      <Link to="/">Inicio</Link>
      <Link to="/products">Productos</Link>

      {user ? (
        <>
          <Link to="/cart">Carrito</Link>
          <Link to="/orders">Órdenes</Link>
          <Link to="/addresses">Direcciones</Link>

          <span>Hola, {user.name}</span>

          <button onClick={handleLogout}>Cerrar sesión</button>
        </>
      ) : (
        <Link to="/login">Iniciar sesión</Link>
      )}
    </nav>
  );
}
