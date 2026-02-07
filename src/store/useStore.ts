import { Product, CartItem, WishlistItem } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { signupApi, loginApi } from "@/api/auth.api";
import {
  getCartApi,
  addToCartApi,
  updateCartItemApi,
  removeFromCartApi,
  clearCartApi,
  getWishlistApi,
  addToWishlistApi,
  removeFromWishlistApi,
} from "@/api/user.api";

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  syncWithBackend: () => Promise<void>;
  setItems: (items: CartItem[]) => void;
}

interface WishlistStore {
  items: WishlistItem[];
  productCache: Product[];
  isLoading: boolean;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  syncWithBackend: () => Promise<void>;
  setItems: (items: WishlistItem[], products?: Product[]) => void;
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

// Check if user is logged in
const isUserLoggedIn = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: async (product, quantity = 1) => {
        const productId = product._id || product.id;

        // Update local state immediately for instant UI feedback
        set((state) => {
          const existingItem = state.items.find(
            (item) => (item.product._id || item.product.id) === productId
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                (item.product._id || item.product.id) === productId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });

        // Sync with backend if logged in
        if (isUserLoggedIn()) {
          try {
            await addToCartApi(productId, quantity);
          } catch (error) {
            console.error("Failed to sync cart with backend:", error);
          }
        }
      },

      removeItem: async (productId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => (item.product._id || item.product.id) !== productId
          ),
        }));

        if (isUserLoggedIn()) {
          try {
            await removeFromCartApi(productId);
          } catch (error) {
            console.error("Failed to sync cart with backend:", error);
          }
        }
      },

      updateQuantity: async (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            (item.product._id || item.product.id) === productId
              ? { ...item, quantity }
              : item
          ),
        }));

        if (isUserLoggedIn()) {
          try {
            await updateCartItemApi(productId, quantity);
          } catch (error) {
            console.error("Failed to sync cart with backend:", error);
          }
        }
      },

      clearCart: async () => {
        set({ items: [] });
        if (isUserLoggedIn()) {
          try {
            await clearCartApi();
          } catch (error) {
            console.error("Failed to clear cart on backend:", error);
          }
        }
      },

      getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((acc, item) => {
          const price = item.product.finalPrice || (item.product.discount
            ? item.product.price * (1 - item.product.discount.percentage / 100)
            : item.product.price);
          return acc + price * item.quantity;
        }, 0),

      syncWithBackend: async () => {
        if (!isUserLoggedIn()) return;

        set({ isLoading: true });
        try {
          const data = await getCartApi();
          if (data?.cart) {
            const items: CartItem[] = data.cart.map((item: any) => ({
              product: {
                ...item.product,
                id: item.product._id,
                name: item.product.productName,
              },
              quantity: item.quantity,
            }));
            set({ items, isLoading: false });
          }
        } catch (error) {
          console.error("Failed to fetch cart from backend:", error);
          set({ isLoading: false });
        }
      },

      setItems: (items) => set({ items }),
    }),
    { name: "parve-cart" }
  )
);

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      productCache: [],
      isLoading: false,

      addItem: async (productId) => {
        const currentItems = get().items;

        // Prevent Adding Duplicates
        if (currentItems.some(item => item.productId === productId)) {
          return;
        }

        const previousItems = currentItems;

        set((state) => ({
          items: [...state.items, { productId, addedAt: new Date().toISOString() }],
        }));

        if (isUserLoggedIn()) {
          try {
            await addToWishlistApi(productId);
          } catch (error) {
            console.error("Failed to sync wishlist with backend:", error);
            // Rollback on error
            set({ items: previousItems });
          }
        }
      },

      removeItem: async (productId) => {
        const previousItems = get().items;

        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));

        if (isUserLoggedIn()) {
          try {
            await removeFromWishlistApi(productId);
          } catch (error) {
            console.error("Failed to sync wishlist with backend:", error);
            // Rollback on error
            set({ items: previousItems });
          }
        }
      },

      isInWishlist: (productId) =>
        get().items.some((item) => item.productId === productId),

      syncWithBackend: async () => {
        if (!isUserLoggedIn()) return;

        set({ isLoading: true });
        try {
          const data = await getWishlistApi();
          if (data?.wishlist) {
            const items: WishlistItem[] = data.wishlist.map((product: any) => ({
              productId: product._id,
              addedAt: new Date().toISOString(),
            }));
            const productCache = data.wishlist.map((p: any) => ({
              ...p,
              id: p._id,
              name: p.productName,
            }));
            set({ items, productCache, isLoading: false });
          }
        } catch (error) {
          console.error("Failed to fetch wishlist from backend:", error);
          set({ isLoading: false });
        }
      },

      setItems: (items, products) =>
        set({ items, productCache: products || get().productCache }),
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

          // Sync cart and wishlist after login
          setTimeout(() => {
            useCartStore.getState().syncWithBackend();
            useWishlistStore.getState().syncWithBackend();
          }, 100);

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
        // Clear cart and wishlist on logout
        useCartStore.getState().setItems([]);
        useWishlistStore.getState().setItems([]);
      },
    }),
    {
      name: "parve-auth",
    }
  )
);
