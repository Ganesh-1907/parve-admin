import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTokenExpiryTime } from "@/lib/auth";
import { useAuthStore } from "@/store/useStore";

const SessionWatcher = () => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (!token) return;

    const expiryTime = getTokenExpiryTime(token);
    if (!expiryTime) {
      logout();
      navigate("/login", { replace: true });
      return;
    }

    const remainingTime = expiryTime - Date.now();

    if (remainingTime <= 0) {
      logout();
      navigate("/login", { replace: true });
      return;
    }

    const timeoutId = window.setTimeout(() => {
      logout();
      navigate("/login", { replace: true });
    }, remainingTime);

    return () => window.clearTimeout(timeoutId);
  }, [token, logout, navigate]);

  return null;
};

export default SessionWatcher;
