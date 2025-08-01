import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";

const RequireAuth: React.FC = () => {
    const { user, isLoading, isAuthenticated } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
        );
    }

    // If user is not authenticated, redirect to login
    if (!user || !isAuthenticated) {
        console.log('RequireAuth: User not authenticated, redirecting to login');
        return <Navigate to="/login" state={{ path: location.pathname }} replace />;
    }

    console.log('RequireAuth: User authenticated, rendering protected content');
    // User is authenticated, render the protected routes
    return <Outlet />;
};

export default RequireAuth;