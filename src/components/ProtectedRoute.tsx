import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useStore";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
