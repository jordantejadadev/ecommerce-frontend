import api from "../api/axios";

export const createUser = async (name, email, password) => {
  const response = await api.post("/users", {
    name,
    email,
    password,
  });

  return response.data;
};
