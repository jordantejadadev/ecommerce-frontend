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
    <nav className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold text-gray-900">
          E-Commerce
        </Link>
        <div className="flex items-center gap-6">
          <Link
            to="/products"
            className="text-gray-700 transition hover:text-black"
          >
            Productos
          </Link>

          {user && (
            <>
              <Link
                to="/cart"
                className="text-gray-700 transition hover:text-black"
              >
                Carrito
              </Link>
              <Link
                to="/orders"
                className="text-gray-700 transition hover:text-black"
              >
                Órdenes
              </Link>
              <Link
                to="/addresses"
                className="text-gray-700 transition hover:text-black"
              >
                Direcciones
              </Link>

              {user.role === "ADMIN" && (
                <>
                  <Link
                    to="/admin/products"
                    className="text-gray-700 transition hover:text-black"
                  >
                    Admin Productos
                  </Link>
                  <Link
                    to="/admin/categories"
                    className="text-gray-700 transition hover:text-black"
                  >
                    Admin Categorías
                  </Link>
                </>
              )}

              <span className="text-sm font-medium text-gray-900">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Cerrar sesión
              </button>
            </>
          )}
          {!user && (
            <Link
              to="/login"
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
