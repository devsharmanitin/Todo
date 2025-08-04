import { useAuth } from "../context/AuthContext";
import Login from '../components/auth/Login';
import { useNavigate, Outlet } from "react-router-dom";
import { useEffect } from "react";


export const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, isLoading, isVerified } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                navigate("/login");
            } else if (!isVerified) {
                navigate("/verify/profile");
            }
        }
    }, [isAuthenticated, isLoading, isVerified, navigate]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // If redirecting, render nothing
    if (!isAuthenticated || !isVerified) {
        return null;
    }

    return <Outlet />;
};