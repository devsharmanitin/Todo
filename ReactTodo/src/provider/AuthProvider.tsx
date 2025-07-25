import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { NavigateFunction } from "react-router";
import toast, { Toaster } from 'react-hot-toast';
import { resolve } from "chart.js/helpers";



interface AuthProviderProps {
    children: ReactNode;
}

interface User {
    username: string;
    email: string;
    token: string | null; // Access token (in-memory)
    permissions: string[];
    image?: string; // Make image optional in the User state interface
}

interface AuthContextType {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    // Make image optional in the login function's parameter type as well
    login: (userData: { username: string; email: string; token: string; permissions: string[]; image?: string }) => void;
    logout: () => Promise<void>;
    refreshAccessToken: () => Promise<string>;
    navigate: ReturnType<typeof useNavigate>;
    redirectPath: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const BaseUrl = "http://localhost:8000/api";
    const navigate = useNavigate();
    const location = useLocation();

    const redirectPath = location.state?.path || "/";

    // Initialize user state with null token (in-memory storage)
    const [user, setUser] = useState<User>({ username: "", email: "", token: null, permissions: [] });

    // For managing concurrent refresh requests
    const isRefreshing = useRef(false);
    const failedQueue = useRef<Array<{ resolve: (value: string) => void; reject: (reason?: any) => void }>>([]);

    // Helper for processing queued requests after a refresh
    const processQueue = (error: Error | null, token: string | null = null) => {
        failedQueue.current.forEach(prom => {
            if (error) {
                prom.reject(error);
            } else if (token) {
                prom.resolve(token);
            }
        });
        failedQueue.current = [];
    }


    // Login Method To set Data in User State
    const login = (userData: { username: string, email: string, token: string, permissions: string[]; image?: string }) => {
        setUser({
            username: userData.username, // THIS IS CORRECT if backend 'user' object has 'username'
            // BUT your backend 'UserResource' returns 'name'
            email: userData.email,
            token: userData.token,
            permissions: userData.permissions || [],
            image: userData.image,
        });
        navigate(redirectPath, { replace: true });
    }

    const logout = async () => {
        try {
            // Call backend logout endpoint to invalidate tokens and clear HttpOnly cookie
            const response = await fetch(`${BaseUrl}/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    'Authorization': `Bearer ${user.token}`, // Keep this for backend validation
                },
                credentials: 'include', // <<< ADD THIS FOR COOKIES
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => { message: "failed to logout from server" });
                console.error("Backend logout failed:", errorData);
                toast.error(errorData.message || "Failed to log out on server.");
            } else {
                toast.success("Logged out successfully!");
            }
        } catch (error) {
            console.error("Network error during logout:", error);
            toast.error("Network error during logout. Please try again.");
        } finally {
            // Clear client-side state regardless of backend response
            setUser({ username: "", email: "", token: null, permissions: [], image: "" });
            navigate("/login", { replace: true });
        }
    }

    // --- Token Refresh Function ---
    // This function is designed to be called by the API client when a 401 is received.
    const refreshAccessToken = async (): Promise<string> => {
        // If a refresh is already in progress due to concurrent requests, queue the current request
        if (isRefreshing.current) {
            return new Promise((resolve, reject) => {
                failedQueue.current.push({ resolve, reject });
            })
        }
        isRefreshing.current = true; // Set flag to indicate refresh is starting

        try {
            console.log('AuthProvider: Attempting to refresh token from backend...');
            // This fetch call relies on the browser automatically sending the HttpOnly 'refresh_token' cookie.

            const response = await fetch(`${BaseUrl}/auth/refresh`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    // DO NOT send user.token (access token) in header for refresh, as per our secure pattern.
                    // Laravel will use the HttpOnly refresh_token cookie to identify the user and issue a new access token.
                },
                body: JSON.stringify({}),
                credentials: 'include',
            });
            if (!response.ok) {
                // This means the refresh token (cookie) has also expired or is invalid.
                console.error('AuthProvider: Refresh token expired or invalid. Forcing re-login.');
                logout(); // Clear all tokens and redirect to login
                processQueue(new Error("Refresh token expired. Please log in again."));
                throw new Error('Refresh token expired.');
            }

            const data = await response.json();
            if (!data.success || !data.access_token) {
                console.error('AuthProvider: Refresh endpoint did not return a new access_token or was not successful.');
                logout();
                processQueue(new Error("Invalid refresh response from server."));
                throw new Error("Invalid refresh response.");
            }

            // Successfully got a new access token
            const newAccessToken = data.access_token;
            setUser(prevUser => {
                const updatedUser = { ...prevUser, token: newAccessToken };
                return updatedUser;
            });

            console.log('AuthProvider: Access token refreshed successfully!');
            processQueue(null, newAccessToken); // Resolve queued requests with new token
            return newAccessToken;

        } catch (error) {
            console.error('AuthProvider: Error during token refresh:', error);
            logout();
            processQueue(error as Error); // Reject queued requests
            throw error;

        } finally {
            isRefreshing.current = false;
        }
    }

    // Effect to check authentication status on mount (e.g., when a new tab opens)
    // If no access token is in memory, attempt a silent refresh using the HttpOnly cookie.
    useEffect(() => {
        const checkAuthStatus = async () => {
            if (!user.token) { // Only attempt refresh if no access token is currently in state
                try {
                    // Attempt to get a new access token using the refresh token cookie
                    await refreshAccessToken();
                    console.log("Silent refresh successful on app load.");
                } catch (error) {
                    console.log("Silent refresh failed on app load, user remains logged out.");
                    // No need to navigate here, refreshAccessToken's catch already handles logout.

                }
            }
        }

        // Delay slightly to ensure AuthProvider is fully mounted before attempting refresh
        // This can prevent race conditions with initial protected API calls
        const timer = setTimeout(() => {
            checkAuthStatus();
        }, 100); // Small delay

        return () => clearTimeout(timer);
    }, [user.token]); // Re-run if user.token changes (e.g., becomes null on logout)


    const authContextValue: AuthContextType = {
        user,
        setUser,
        login,
        logout,
        refreshAccessToken,
        navigate,
        redirectPath,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
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
