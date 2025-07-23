import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../provider/AuthProvider";

interface PublicRouteProps {
    children: ReactNode;         // 👈 add an explicit type
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { user } = useAuth();

    if (user && user.token) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;
