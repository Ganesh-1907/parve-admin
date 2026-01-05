import { Product, CartItem, WishlistItem } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { signupApi, loginApi } from "@/api/auth.api";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

interface User {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role?: "admin" | "user";
}

interface AuthStore {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;

  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    phone: string,
    address: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.product.id === product.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      getTotalPrice: () =>
        get().items.reduce((acc, item) => {
          const price = item.product.discount
            ? item.product.price * (1 - item.product.discount.percentage / 100)
            : item.product.price;
          return acc + price * item.quantity;
        }, 0),
    }),
    { name: "parve-cart" }
  )
);

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId) => {
        set((state) => ({
          items: [...state.items, { productId, addedAt: new Date().toISOString() }],
        }));
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },
      isInWishlist: (productId) => get().items.some((item) => item.productId === productId),
    }),
    { name: "parve-wishlist" }
  )
);

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      token: null,
      loading: false,

      /* ===== SIGNUP ===== */
      signup: async (name, email, phone, address, password) => {
        try {
          set({ loading: true });

          await signupApi({
            name,
            email,
            phone,
            address,
            password,
            confirmPassword: password,
          });

          set({ loading: false });
          return true;
        } catch (error) {
          console.error("Signup error:", error);
          set({ loading: false });
          return false;
        }
      },

      /* ===== LOGIN ===== */
      login: async (email, password) => {
        try {
          set({ loading: true });

          const res = await loginApi({ email, password });

          localStorage.setItem("token", res.token);

          set({
            isLoggedIn: true,
            user: res.user,
            token: res.token,
            loading: false,
          });

          return true;
        } catch (error) {
          console.error("Login error:", error);
          set({ loading: false });
          return false;
        }
      },

      /* ===== LOGOUT ===== */
      logout: () => {
        localStorage.removeItem("token");
        set({
          isLoggedIn: false,
          user: null,
          token: null,
        });
      },
    }),
    {
      name: "parve-auth",
    }
  )
);

