import api from "./axios";

export const getAdminReviewsApi = async (status?: string) => {
    const url = status ? `/reviews/admin?status=${status}` : "/reviews/admin";
    const response = await api.get(url);
    return response.data;
};

export const updateReviewStatusApi = async (id: string, status: "public" | "private") => {
    const response = await api.put(`/reviews/status/${id}`, { status });
    return response.data;
};
