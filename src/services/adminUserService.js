import api from "../api/axios";

export const getAllUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await api.patch(`/admin/users/${userId}/role`, { role });
  return response.data;
};
