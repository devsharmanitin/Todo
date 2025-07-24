import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { NavigateFunction } from "react-router";



interface AuthProviderProps {
    children: ReactNode;
}

interface User {
    username: string,
    email: string,
    token: string,
    role?: string,
    permissions: string[],
    image: string,
}

interface AuthContextType {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    login: (userData: any) => void;
    logout: () => void;
    navigate: NavigateFunction;
    redirectPath: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const redirectPath = location.state?.path || "/";

    const [user, setUser] = useState<User>({ username: "", image: "", email: "", token: "", permissions: [] });
    console.log("AuhhProvider User:- ", user);
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser({
                    username: parsedUser.username || "",
                    email: parsedUser.email || "",
                    token: parsedUser.token || "",
                    permissions: parsedUser.permissions || [],
                    image: parsedUser.image
                });
            } catch (e) {
                // If parsing fails, clear localStorage
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        }
    }, []);

    const login = (userData: any) => {
        if (userData.role === 'admin') {
            setUser({ username: userData.username, image: userData.image, email: userData.email, token: userData.token, permissions: ["view_all"] });
        } else {
            setUser({ username: userData.username, image: userData.image, email: userData.email, token: userData.token, permissions: ["view_own"] });
        }
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", userData.token);
        navigate(redirectPath, { replace: true });
    }

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser({ username: "", email: "", image: "", token: "", permissions: [] });
        navigate("/login", { replace: true });
    };



    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, navigate, redirectPath }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;



export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export { AuthContext };
