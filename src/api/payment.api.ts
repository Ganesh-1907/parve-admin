import api from "./axios";

export const createRazorpayOrderApi = async (data: { items: any[], address: string }) => {
    const response = await api.post("/payment/create-order", data);
    return response.data;
};

export const verifyPaymentApi = async (data: any) => {
    const response = await api.post("/payment/verify", data);
    return response.data;
};

export const getRazorpayKeyApi = async () => {
    const response = await api.get("/payment/key");
    return response.data;
};
