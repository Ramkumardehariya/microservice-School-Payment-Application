import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../UI/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner/>; // ⏳ show loader until checkAuthStatus finishes
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="p-6">{children}</main>
      </div>
    );
};

export default ProtectedRoute;