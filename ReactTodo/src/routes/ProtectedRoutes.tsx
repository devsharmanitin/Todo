import { useAuth } from "../context/AuthContext";
import Login from '../components/auth/Login';
import { Navigate, Outlet } from "react-router-dom";


export const ProtectedRoute: React.FC = ({ }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Login />;
    }

    return <>{<Outlet />}</>;
};