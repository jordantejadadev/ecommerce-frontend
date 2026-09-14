import { useEffect, useState } from "react";
import { getAllUsers, updateUserRole } from "../services/adminUserService";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setError("");
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      setError("No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas cambiar este usuario a ${newRole}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");
      setUpdatingId(userId);

      const updatedUser = await updateUserRole(userId, newRole);

      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? updatedUser : user)),
      );

      setMessage("Rol actualizado correctamente");
    } catch (error) {
      setError(
        error.response?.data?.message || "No se pudo actualizar el rol",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">
          Administrar usuarios
        </h1>

        {error && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-lg border border-green-300 bg-green-100 px-4 py-3 text-green-700">
            {message}
          </div>
        )}

        <section className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-5 text-xl font-semibold text-gray-800">
            Usuarios
          </h2>

          {loading ? (
            <p className="text-gray-500">Cargando usuarios...</p>
          ) : users.length === 0 ? (
            <p className="text-gray-500">No hay usuarios registrados.</p>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        user.role === "ADMIN"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.role}
                    </span>

                    <button
                      disabled={updatingId === user.id}
                      onClick={() =>
                        handleRoleChange(
                          user.id,
                          user.role === "ADMIN" ? "USER" : "ADMIN",
                        )
                      }
                      className="rounded-lg border border-blue-300 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {updatingId === user.id
                        ? "Actualizando..."
                        : user.role === "ADMIN"
                          ? "Quitar admin"
                          : "Hacer admin"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}