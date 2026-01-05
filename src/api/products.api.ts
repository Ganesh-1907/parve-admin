import api from "./axios";

export const getProductsApi = async () => {
  const res = await api.get("/products");
  return res.data;
};

export const getSingleProductApi = async (id: string) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};
