import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="relative border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-900">
            E-Commerce
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-6 md:flex">
            <Link to="/products" className="text-gray-700 hover:text-black">
              Productos
            </Link>
            {user && (
              <>
                <Link to="/cart" className="text-gray-700 hover:text-black">
                  Carrito
                </Link>
                <Link to="/orders" className="text-gray-700 hover:text-black">
                  Órdenes
                </Link>
                <Link
                  to="/addresses"
                  className="text-gray-700 hover:text-black"
                >
                  Direcciones
                </Link>
                {user.role === "ADMIN" && (
                  <>
                    <Link
                      to="/admin/products"
                      className="text-gray-700 hover:text-black"
                    >
                      Admin Productos
                    </Link>
                    <Link
                      to="/admin/categories"
                      className="text-gray-700 hover:text-black"
                    >
                      Admin Categories
                    </Link>
                    <Link
                      to="/admin/users"
                      className="text-gray-700 hover:text-black"
                    >Admin Users</Link>
                  </>
                )}
                <span className="text-sm font-medium text-gray-900">
                  {user.name}
                </span>

                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Cerrar sesión
                </button>
              </>
            )}

            {!user && (
              <Link
                to="/login"
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Iniciar sesión
              </Link>
            )}
          </div>

          {/* Mobile button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
            aria-label="Abrir menú"
          >
            <span className="text-2xl">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="absolute left-0 right-0 z-50 border-t bg-white px-6 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <Link
                to="/products"
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 hover:text-black"
              >
                Productos
              </Link>
              {user && (
                <>
                  <Link
                    to="/cart"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-700 hover:text-black"
                  >
                    Carrito
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-700 hover:text-black"
                  >
                    Órdenes
                  </Link>
                  <Link to="/addresses" onClick={() => setMenuOpen(false)}>
                    Direcciones
                  </Link>
                  {user.role === "ADMIN" && (
                    <>
                      <Link
                        to="/admin/products"
                        onClick={() => setMenuOpen(false)}
                        className="text-gray-700 hover:text-black"
                      >
                        Admin Productos
                      </Link>
                      <Link
                        to="/admin/categories"
                        onClick={() => setMenuOpen(false)}
                        className="text-gray-700 hover:text-black"
                      >
                        Admin Categorías
                      </Link>
                      <Link
                        to="/admin/users"
                        onClick={() => setMenuOpen(false)}
                        className="text-gray-700 hover:text-black"
                      >
                        Admin Users
                      </Link>
                    </>
                  )}

                  <span className="text-sm font-medium text-gray-900">
                    Hola, {user.name}
                  </span>

                  <button
                    onClick={handleLogout}
                    className="w-fit rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Cerrar sesión
                  </button>
                </>
              )}

              {!user && (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-fit rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
                >
                  Iniciar sesión
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
