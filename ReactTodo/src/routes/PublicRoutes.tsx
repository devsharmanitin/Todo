import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface PublicRouteProps {
    children: ReactNode;         // 👈 add an explicit type
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();

    if (user && isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;
