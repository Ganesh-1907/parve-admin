import api from "./axios";

export const getMyOrdersApi = async () => {
    const res = await api.get("/orders/my-orders");
    return res.data;
};

export const getOrderByIdApi = async (id: string) => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
};
