import { useEffect, useState } from "react";
import { getAddresses, createAddress } from "../services/addressService";
import { toast } from "sonner";

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const data = await getAddresses();
        setAddresses(data);
      } catch (error) {
        toast.error("No se pudieron cargar las direcciones");
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newAddress = await createAddress(form);

      setAddresses([...addresses, newAddress]);

      setForm({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      });

      toast.success("Dirección agregada correctamente");
    } catch (error) {
      toast.error("No se puede crear la dirección");
    }
  };

  return (
    <div className="flex-1 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">
          Mis direcciones
        </h1>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Direcciones existentes */}
          <section className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-5 text-xl font-semibold text-gray-800">
              Direcciones guardadas
            </h2>

            {loading ? (
              /* Skeleton para la lista de direcciones */
              <div className="animate-pulse space-y-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="space-y-2 rounded-lg border border-gray-200 p-4"
                  >
                    <div className="h-5 w-3/4 rounded bg-gray-200" />
                    <div className="h-4 w-1/2 rounded bg-gray-200" />
                    <div className="h-4 w-1/4 rounded bg-gray-200" />
                    <div className="h-4 w-1/3 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : addresses.length === 0 ? (
              <p className="text-gray-500">No tienes direcciones guardadas</p>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <p className="font-medium text-gray-800">
                      {address.street}
                    </p>
                    <p className="text-gray-600">
                      {address.city}, {address.state}
                    </p>
                    <p className="text-gray-600">{address.postalCode}</p>
                    <p className="text-gray-600">{address.country}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Formulario */}
          <section className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-5 text-xl font-semibold text-gray-800">
              Agregar dirección
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="street"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Calle
                </label>
                <input
                  id="street"
                  type="text"
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="city"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Ciudad
                </label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="state"
                  className="mb-1 block text-sm font-semibold text-gray-700"
                >
                  Estado / Provincia
                </label>
                <input
                  id="state"
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="postalCode"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Código postal
                </label>
                <input
                  id="postalCode"
                  type="text"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="country"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  País
                </label>
                <input
                  id="country"
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-black py-3 font-semibold text-white transition hover:bg-gray-800 cursor-pointer disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                Agregar dirección
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
