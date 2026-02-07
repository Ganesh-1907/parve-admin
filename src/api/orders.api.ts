import api from "./axios";

export const getAllOrdersApi = async () => {
    const response = await api.get("/orders/admin");
    return response.data;
};

export const updateOrderStatusApi = async (id: string, status: string) => {
    const response = await api.put(`/orders/admin/status/${id}`, { status });
    return response.data;
};
