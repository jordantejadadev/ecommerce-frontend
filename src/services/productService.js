import api from "../api/axios";

export const getProducts = async ({ page = 1, size = 4, categoryId, sort, signal } = {}) => {
  const response = await api.get("/products", {
    params: {
      page: page - 1,
      size,      
      ...(categoryId && { categoryId }), // solo lo incluye si hay un valor      
      sort
    },
    signal
  });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (product) => {
  const response = await api.post("/products", product);
  return response.data;
};

export const updateProduct = async (id, product) => {
  const response = await api.put(`/products/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const uploadProductImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/products/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data.imageUrl;
};
