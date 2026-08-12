import { useAuth } from "../context/AuthContext";
import LoginRequired from "./LoginRequired"; // 👈 add this import

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
        <span className="text-sm text-[#8B8D98]">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <LoginRequired />; // 👈 was: <Navigate to="/login" replace />
  }

  return children;
}