import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/authStore";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useAuthStore();

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (user?.role !== "Admin") return <Navigate to="/" replace />;

  return <>{children}</>;
}