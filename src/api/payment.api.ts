export const createRazorpayOrderApi = async (data: { items: any[], address: string }) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/payment/create-order`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const verifyPaymentApi = async (data: any) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/payment/verify`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const getRazorpayKeyApi = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/payment/key`);
    return response.json();
};
