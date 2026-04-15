const TOKEN_STORAGE_KEY = "token";
const AUTH_STORAGE_KEY = "parve-auth";
const CART_STORAGE_KEY = "parve-cart";
const WISHLIST_STORAGE_KEY = "parve-wishlist";
const ADMIN_REOPEN_MARKER_KEY = "parve-admin-reopen-marker";

const getSessionStorage = () => window.sessionStorage;
const getLocalStorage = () => window.localStorage;

const decodeJwtPayload = (token: string) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const normalized = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");

    return JSON.parse(window.atob(normalized));
  } catch {
    return null;
  }
};

export const getStoredToken = () => getSessionStorage().getItem(TOKEN_STORAGE_KEY);

export const setStoredToken = (token: string) => {
  getSessionStorage().setItem(TOKEN_STORAGE_KEY, token);
};

export const isTokenExpired = (token: string) => {
  const payload = decodeJwtPayload(token);

  if (!payload || typeof payload.exp !== "number") {
    return true;
  }

  return payload.exp * 1000 <= Date.now();
};

export const getTokenExpiryTime = (token: string) => {
  const payload = decodeJwtPayload(token);

  if (!payload || typeof payload.exp !== "number") {
    return null;
  }

  return payload.exp * 1000;
};

export const hasValidToken = () => {
  const token = getStoredToken();
  return !!token && !isTokenExpired(token);
};

export const clearPersistedSession = () => {
  getSessionStorage().removeItem(TOKEN_STORAGE_KEY);
  getSessionStorage().removeItem(AUTH_STORAGE_KEY);
  getSessionStorage().removeItem(CART_STORAGE_KEY);
  getSessionStorage().removeItem(WISHLIST_STORAGE_KEY);
  getLocalStorage().removeItem(ADMIN_REOPEN_MARKER_KEY);
};

export const markAdminSessionForNextOpen = () => {
  getLocalStorage().setItem(ADMIN_REOPEN_MARKER_KEY, String(Date.now()));
};

export const shouldLogoutAdminOnOpen = () => {
  const marker = getLocalStorage().getItem(ADMIN_REOPEN_MARKER_KEY);
  getLocalStorage().removeItem(ADMIN_REOPEN_MARKER_KEY);

  if (!marker) {
    return false;
  }

  const navigationEntry = performance.getEntriesByType("navigation")[0];
  const navigationType =
    navigationEntry && "type" in navigationEntry ? navigationEntry.type : "navigate";

  return navigationType !== "reload";
};
