import { useEffect, useState } from "react";
import { getAddresses, createAddress } from "../services/addressService";

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        console.error(error);
        setError("No se pudieron cargar las direcciones");
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
    setError("");

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
    } catch (error) {
      console.error(error);
      setError("No se puede crear la dirección");
    }
  };

  if (loading) {
    return <p>Cargando direcciones...</p>;
  }

  return (
    <div>
      <h1>Mis direcciones</h1>

      {error && <p>{error}</p>}

      {addresses.length === 0 ? (
        <p>No tienes direcciones registradas</p>
      ) : (
        addresses.map((address) => (
          <div key={address.id} style={{ marginBottom: "40px" }}>
            <p>{address.street}</p>
            <p>
              {address.city}, {address.state}
            </p>
            <p>
              {address.postalCode} - {address.country}
            </p>
          </div>
        ))
      )}

      <h2>Agregar dirección</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="street"
          placeholder="Dirección"
          value={form.street}
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          placeholder="Ciudad"
          value={form.city}
          onChange={handleChange}
        />
        <input
          type="text"
          name="state"
          placeholder="Estado / Departamento"
          value={form.state}
          onChange={handleChange}
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Código Postal"
          value={form.postalCode}
          onChange={handleChange}
        />
        <input
          type="text"
          name="country"
          placeholder="País"
          value={form.country}
          onChange={handleChange}
        />

        <button type="submit">Agregar dirección</button>
      </form>
    </div>
  );
}
