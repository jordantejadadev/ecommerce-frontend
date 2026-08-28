import api from "../api/axios";

export const createOrder = async (addressId) => {
    const response = await api.post("/users/orders", {
        addressId
    });

    return response.data;
}

export const getOrders = async () => {
    const response = await api.get("/users/orders");
    return response.data;
}

export const getOrderById = async (orderId) => {
    const response = await api.get(`/users/orders/${orderId}`);
    return response.data;
}

export const cancelOrder = async (orderId) => {
    const response = await api.patch(`/users/orders/${orderId}/cancel`);
    return response.data;
}