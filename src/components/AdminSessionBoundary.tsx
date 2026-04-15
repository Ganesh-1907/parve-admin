import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  markAdminSessionForNextOpen,
  shouldLogoutAdminOnOpen,
} from "@/lib/auth";
import { useAuthStore } from "@/store/useStore";

const AdminSessionBoundary = () => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (shouldLogoutAdminOnOpen()) {
      logout();
      navigate("/login", { replace: true });
    }
  }, [logout, navigate]);

  useEffect(() => {
    const handlePageExit = () => {
      if (!token) {
        return;
      }

      markAdminSessionForNextOpen();
    };

    window.addEventListener("beforeunload", handlePageExit);
    window.addEventListener("pagehide", handlePageExit);

    return () => {
      window.removeEventListener("beforeunload", handlePageExit);
      window.removeEventListener("pagehide", handlePageExit);
    };
  }, [token]);

  return null;
};

export default AdminSessionBoundary;
