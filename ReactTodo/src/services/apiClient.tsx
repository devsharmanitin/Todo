import { useAuth } from "../provider/AuthProvider";
import React from "react";

const BaseUrl = "http://localhost:8000/api";


// This ref will hold the current auth context functions (user.token, refreshAccessToken, logout)
// so that our fetchWithAuth function (which is not a React component) can access them.
// We'll use a wrapper component ApiClientProvider to set this ref.


let authFunctionsRef: {
    userToken: string | null;
    refreshAccessToken: (() => Promise<string>) | null;
    logout: (() => Promise<void>) | null; // Logout is now async
    setAuth: (userToken: string | null, refresh: (() => Promise<string>) | null, logout: (() => Promise<void>) | null) => void;
} = {
    userToken: null,
    refreshAccessToken: null,
    logout: null,
    setAuth: (userToken, refresh, logout) => {
        authFunctionsRef.userToken = userToken;
        authFunctionsRef.refreshAccessToken = refresh;
        authFunctionsRef.logout = logout;
    }
}

// This component ensures our authFunctionsRef is always up-to-date
// It should wrap your <App /> component inside <AuthProvider>
export const ApiClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, refreshAccessToken, logout } = useAuth(); // Destructure what's needed from useAuth
    const userToken = user.token || null; // Get token from the user object

    // Update the ref whenever auth context values change.
    // This effectively "injects" the latest auth context into the non-React `fetchWithAuth` scope.
    React.useRef(() => authFunctionsRef.setAuth(userToken, refreshAccessToken, logout)).current();

    return <>{children}</>;
}


// The core fetch wrapper with automatic token refresh and retry logic
async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}, isRetry: boolean = false): Promise<T> {
    const originalRequest = { ...options }; // Keep original request options for retry

    const getHeaders = (tokenOverride: string | null = null): HeadersInit => ({
        "Content-Type": "application/json", // Correct for JSON APIs
        "Accept": "application/json",
        // Use tokenOverride (for retried requests) or current userToken from ref
        ...(tokenOverride ? { "Authorization": `Bearer ${tokenOverride}` } : (authFunctionsRef.userToken ? { "Authorization": `Bearer ${authFunctionsRef.userToken}` } : {})),
        ...options.headers, // Merge any custom headers passed to the original call
    });

    try {
        let response = await fetch(BaseUrl + endpoint, {
            ...options,
            headers: getHeaders(),
            credentials: 'include',
        });

        // --- THE TOKEN EXPIRATION DETECTION HAPPENS HERE ---
        // If we get a 401 Unauthorized AND it's not already a retried request
        // AND we have the refresh function available from AuthContext
        if (response.status === 401 && !isRetry && authFunctionsRef.refreshAccessToken) {
            console.warn('ApiClient: API call received 401. Attempting token refresh...');

            try {
                // Call the refresh function from AuthContext.
                // This function handles the actual /auth/refresh API call,
                // updates the token, and manages concurrency.
                const newAccessToken = await authFunctionsRef.refreshAccessToken();

                // Token successfully refreshed. Retry the original request with the new token.
                console.log('ApiClient: Token refreshed. Retrying original request with new token...');
                // Recursive call, marking it as a retry. The new token is now in authFunctionsRef.userToken.
                return await fetchWithAuth<T>(endpoint, originalRequest, true);

            } catch (refreshError) {
                // Refresh failed (e.g., refresh token expired, network error during refresh)
                console.error('ApiClient: Failed to refresh token, forcing re-login:', refreshError);
                if (authFunctionsRef.logout) {
                    await authFunctionsRef.logout(); // Force logout (async)
                }
                throw new Error("Authentication required: Please log in again.");
            }
        }
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown API error' }));
            // If it's a 401 after a retry (meaning new token didn't work), or if no refresh function
            if (response.status === 401) { // This 401 is either after retry or no refresh capability
                console.error("ApiClient: Authentication failed or session expired.");
                if (authFunctionsRef.logout) {
                    await authFunctionsRef.logout(); // Force logout (async)
                }
                throw new Error("Authentication required.");
            }
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Server error.'}`);
        }

        return await response.json() as T; // Cast to T for better type safety
    } catch (error) {
        console.error("ApiClient: Fetch error for endpoint", endpoint, ":", error);
        throw error;
    }
}


// Export your get and post methods, which now use the enhanced fetchWithAuth
export const getRequest = <T = any>(endpoint: string): Promise<T> => fetchWithAuth<T>(endpoint, { method: "GET" });
export const postRequest = <T = any>(endpoint: string, data: any): Promise<T> => fetchWithAuth<T>(endpoint, { method: "POST", body: JSON.stringify(data) });

export const putRequest = <T = any>(endpoint: string, data: any): Promise<T> => fetchWithAuth<T>(endpoint, { method: "PUT", body: JSON.stringify(data) });
export const deleteRequest = <T = any>(endpoint: string): Promise<T> => fetchWithAuth<T>(endpoint, { method: "DELETE" });