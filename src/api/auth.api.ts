import api from "./axios";

interface SignupPayload {
    name: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    confirmPassword: string;
}

interface LoginPayload {
    email: string;
    password: string;
}

export const signupApi = async (payload: SignupPayload) => {
    const response = await api.post("/auth/signup", payload);
    return response.data;
};

export const loginApi = async (payload: LoginPayload) => {
    const response = await api.post("/auth/login", payload);
    return response.data;
};
