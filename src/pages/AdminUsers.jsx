import { useEffect, useState } from "react";
import { getAllUsers, updateUserRole } from "../services/adminUserService";
import { toast } from "sonner";
import ConfirmModal from "../components/ConfirmModal";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [pendingChange, setPendingChange] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error("No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  // Ahora solo ABRE el modal, no ejecuta el cambio todavía
  const handleRoleChange = (userId, newRole) => {
    setPendingChange({ userId, newRole });
  };

  // Esto se ejecuta cuando el usuario confirma en el modal
  const confirmRoleChange = async () => {
    const { userId, newRole } = pendingChange;

    try {
      setUpdatingId(userId);
      setPendingChange(null); // cierra el modal

      const updatedUser = await updateUserRole(userId, newRole);

      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? updatedUser : user)),
      );
      toast.success("Rol actualizado correctamente");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "No se pudo actualizar el rol",
      );
    } finally {
      setUpdatingId(null);
    }
  };
  //   const confirmed = window.confirm(
  //     `¿Seguro que deseas cambiar este usuario a ${newRole}?`,
  //   );

  //   if (!confirmed) {
  //     return;
  //   }

  //   try {
  //     setUpdatingId(userId);

  //     const updatedUser = await updateUserRole(userId, newRole);

  //     setUsers((prev) =>
  //       prev.map((user) => (user.id === userId ? updatedUser : user)),
  //     );

  //     toast.success("Rol actualizado correctamente");
  //   } catch (error) {
  //     toast.error(
  //       error.response?.data?.message || "No se pudo actualizar el rol",
  //     );
  //   } finally {
  //     setUpdatingId(null);
  //   }
  // };

  return (
    <div className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">
          Administrar usuarios
        </h1>

        <section className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-5 text-xl font-semibold text-gray-800">Usuarios</h2>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((item) => (
                <div
                  key={item}
                  className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between animate-pulse"
                >
                  <div className="flex flex-col justify-center gap-1.5 py-0.5">
                    <div className="h-4.5 w-36 rounded bg-gray-200" />{" "}
                    {/* Reemplaza al h3 (20px) */}
                    <div className="h-3.5 w-48 rounded bg-gray-200" />{" "}
                    {/* Reemplaza al p.text-sm (14px) */}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-7 w-16 rounded-full bg-gray-200" />{" "}
                    {/* Badge */}
                    <div className="h-9 w-28 rounded-lg bg-gray-200" />{" "}
                    {/* Botón */}
                  </div>
                </div>
              ))}
            </div>
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
                    <h3 className="font-medium text-gray-800">{user.name}</h3>
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

      <ConfirmModal
        open={pendingChange !== null}
        title="Cambiar rol"
        message={
          pendingChange &&
          `¿Seguro que deseas cambiar este usuario a ${pendingChange.newRole}?`
        }
        confirmText="Sí, cambiar"
        onConfirm={confirmRoleChange}
        onCancel={() => setPendingChange(null)}
      />
    </div>
  );
}
