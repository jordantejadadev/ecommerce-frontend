import api from "../api/axios";

export const getAddresses = async () => {
    const response = await api.get("/addresses");
    return response.data;
}

export const createAddress = async (address) => {
    const response = await api.post("/addresses", address);
    return response.data;
}