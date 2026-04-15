import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useStore";
import { clearPersistedSession, hasValidToken } from "@/lib/auth";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isLoggedIn, user } = useAuthStore();

  if (!isLoggedIn || !hasValidToken()) {
    clearPersistedSession();
    return <Navigate to="/login" replace />;
  }

  // backend sends role in login response
  if (user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
