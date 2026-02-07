import api from "./axios";

// ================= CART APIs =================

export const getCartApi = async () => {
    const res = await api.get("/users/cart");
    return res.data;
};

export const addToCartApi = async (productId: string, quantity: number = 1) => {
    const res = await api.post("/users/cart", { productId, quantity });
    return res.data;
};

export const updateCartItemApi = async (productId: string, quantity: number) => {
    const res = await api.put(`/users/cart/${productId}`, { quantity });
    return res.data;
};

export const removeFromCartApi = async (productId: string) => {
    const res = await api.delete(`/users/cart/${productId}`);
    return res.data;
};

export const clearCartApi = async () => {
    const res = await api.delete("/users/cart");
    return res.data;
};

// ================= WISHLIST APIs =================

export const getWishlistApi = async () => {
    const res = await api.get("/users/wishlist");
    return res.data;
};

export const addToWishlistApi = async (productId: string) => {
    const res = await api.post("/users/wishlist", { productId });
    return res.data;
};

export const removeFromWishlistApi = async (productId: string) => {
    const res = await api.delete(`/users/wishlist/${productId}`);
    return res.data;
};
