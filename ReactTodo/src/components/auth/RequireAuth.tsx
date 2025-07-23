import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../provider/AuthProvider";
import { useLocation } from "react-router-dom";

const RequireAuth = () => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user.token) {
        return <Navigate to="/login" state={{ path: location.pathname }} replace />;
    }

    return <Outlet />;
};

export default RequireAuth;
