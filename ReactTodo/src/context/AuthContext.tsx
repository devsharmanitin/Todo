import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from "react";


interface TaskSpecificPermission {
    task_id: number;
    task_title: string;
    permissions: {
        can_view: boolean;
        can_edit: boolean;
        can_delete: boolean;
        can_invite: boolean;
    };
}

interface UserPermissions {
    global: string[];
    specific: TaskSpecificPermission[];
}


interface User {
    id: number,
    name: string,
    username: string,
    email: string,
    phone: number,
    created_at: string,
    updated_at: string,
    permissions: UserPermissions,
    role: string,
    type: string,
    image?: string,
    status: number,
    address: string,
    city: string,
    state: string,
    country: string
}

interface AuthState {
    user: User | null | undefined,
    isLoading: boolean,
    error: string | null,
    tokenExpiry: number | null
    isAuthenticated: boolean,
    isVerified: boolean,
    requires_verification: boolean
}

interface LoginCredentials {
    email: string,
    password: string,
}

interface RegisterData {
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
}

interface AuthResponse {
    success: boolean,
    message: string,
    data: {
        user: User,
        access_token?: string,
        expires_in: number,
        requires_verification: boolean;
    },
}

interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
}

interface ApiError {
    success: boolean;
    message: string;
    error_code?: string;
}

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string, requires_verification: boolean }>;
    logout: () => Promise<void>;
    register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
    checkAuthStatus: () => Promise<void>;
    authenticatedRequest: <T = any>(endpoint: string, options?: RequestInit) => Promise<ApiResponse<T>>;
    dispatch: React.Dispatch<AuthAction>;
    hasRole: (roleName: string) => boolean;
    hasGlobalPermission: (PermissionName: string) => boolean;
    hasSpecificPermission: (taskId: number, PermissionName: keyof TaskSpecificPermission["permissions"], user?: User | undefined | null) => boolean;
}

interface OTPReesponse {
    success: boolean,
    message: string,
}



// Auth Context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth Actions
const AUTH_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    REFRESH_TOKEN: 'REFRESH_TOKEN',
    SET_LOADING: 'SET_LOADING',
    CHECK_AUTH: 'CHECK_AUTH',
    VERIFIED: 'VERIFIED',
    NOT_VERIFIED: 'NOT_VERIFIED'
} as const;


type AuthAction =
    | { type: 'LOGIN_START' }
    | { type: 'LOGIN_SUCCESS'; payload: { user: User; tokenExpiry: number } }
    | { type: 'LOGIN_FAILURE'; payload: { error: string } }
    | { type: 'LOGOUT' }
    | { type: 'REFRESH_TOKEN'; payload: { tokenExpiry: number } }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'CHECK_AUTH'; payload: { user: User | null; isAuthenticated: boolean; tokenExpiry: number | null } }
    | { type: 'VERIFIED'; payload: boolean, requires_verification: boolean }
    | { type: 'NOT_VERIFIED'; payload: boolean };


// Initial Auth State
const initialAuthState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    tokenExpiry: null,
    isVerified: false,
    requires_verification: true
};

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_START:
            return {
                ...state,
                isLoading: true,
                error: null
            };
        case AUTH_ACTIONS.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
                tokenExpiry: action.payload.tokenExpiry
            };
        case AUTH_ACTIONS.LOGIN_FAILURE:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload.error
            };
        case AUTH_ACTIONS.LOGOUT:
            return {
                ...initialAuthState,
                isLoading: false
            };
        case AUTH_ACTIONS.REFRESH_TOKEN:
            return {
                ...state,
                tokenExpiry: action.payload.tokenExpiry
            };
        case AUTH_ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            };
        case AUTH_ACTIONS.CHECK_AUTH:
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: action.payload.isAuthenticated,
                isLoading: false,
                tokenExpiry: action.payload.tokenExpiry
            };
        case AUTH_ACTIONS.VERIFIED:
            return {
                ...state,
                isVerified: true,
                requires_verification: true,
            };
        case AUTH_ACTIONS.NOT_VERIFIED:
            return {
                ...state,
                isVerified: false
            }
        default:
            return state;
    }
};

// API Service
class ApiService {
    private baseURL: string;
    private refreshPromise: Promise<AuthResponse> | null;

    constructor() {
        this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
        this.refreshPromise = null;
    }

    async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;
        const config: RequestInit = {
            credentials: 'include' as RequestCredentials, // Important for HTTP-only cookies
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                ...(options.headers as Record<string, string>),
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            // Handle token expiry
            if (response.status === 401) {
                const errorData: ApiError = await response.json().catch(() => ({ success: false, message: 'Unauthorized' }));
                if (errorData.error_code === 'TOKEN_EXPIRED') {
                    throw new Error('TOKEN_EXPIRED');
                }
                throw new Error('UNAUTHORIZED');
            }

            if (!response.ok) {
                const errorData: ApiError = await response.json().catch(() => ({ success: false, message: `HTTP ${response.status}` }));
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    // Auth endpoints
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async logout(): Promise<ApiResponse> {
        return this.request('/logout', {
            method: 'POST',
        });
    }

    async refreshToken(): Promise<AuthResponse> {
        return this.request('/auth/refresh', {
            method: 'POST',
        });
    }

    async getUser(): Promise<AuthResponse> {
        return this.request('/auth/me');
    }

    async register(userData: RegisterData): Promise<AuthResponse> {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

}

const apiService = new ApiService();

// Token Refresh Manager
class TokenManager {
    private dispatch: React.Dispatch<AuthAction>;
    private refreshTimer: ReturnType<typeof setTimeout> | null;
    private isRefreshing: boolean;

    constructor(dispatch: React.Dispatch<AuthAction>) {
        this.dispatch = dispatch;
        this.refreshTimer = null;
        this.isRefreshing = false;
    }

    // Calculate time until token expires (in milliseconds)
    getTimeUntilExpiry(expiryTime: number): number {
        return expiryTime - Date.now();
    }

    // Schedule token refresh before expiry
    scheduleRefresh(tokenExpiry: number): void {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
        }

        const timeUntilExpiry = this.getTimeUntilExpiry(tokenExpiry);
        // Refresh 2 minutes before expiry
        const refreshTime = Math.max(timeUntilExpiry - 2 * 60 * 1000, 0);

        this.refreshTimer = setTimeout(() => {
            this.handleTokenRefresh();
        }, refreshTime);
    }

    async handleTokenRefresh(): Promise<void> {
        if (this.isRefreshing) return;

        this.isRefreshing = true;

        try {
            const response = await apiService.refreshToken();
            const newTokenExpiry = Date.now() + (response.data.expires_in * 1000);

            this.dispatch({
                type: AUTH_ACTIONS.REFRESH_TOKEN,
                payload: { tokenExpiry: newTokenExpiry }
            });

            // Schedule next refresh
            this.scheduleRefresh(newTokenExpiry);
        } catch (error) {
            console.error('Token refresh failed:', error);
            // Force logout if refresh fails
            this.dispatch({ type: AUTH_ACTIONS.LOGOUT });
        } finally {
            this.isRefreshing = false;
        }
    }

    clearRefreshTimer(): void {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
    }
}


interface AuthProviderProps {
    children: ReactNode;
}


// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialAuthState);
    const tokenManager = new TokenManager(dispatch);

    // Check authentication status on app load
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Set up token refresh when user is authenticated
    useEffect(() => {
        if (state.isAuthenticated && state.tokenExpiry) {
            tokenManager.scheduleRefresh(state.tokenExpiry);
        } else {
            tokenManager.clearRefreshTimer();
        }

        return () => tokenManager.clearRefreshTimer();
    }, [state.isAuthenticated, state.tokenExpiry]);

    const checkAuthStatus = async (): Promise<void> => {
        try {
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
            const response = await apiService.getUser();

            // Calculate token expiry from response
            const tokenExpiry = Date.now() + (response.data.expires_in * 1000);

            dispatch({
                type: AUTH_ACTIONS.CHECK_AUTH,
                payload: {
                    user: response.data.user,
                    isAuthenticated: true,
                    tokenExpiry
                }
            });

            if (response.data.user.status === 1) {
                dispatch({ type: AUTH_ACTIONS.VERIFIED, payload: true, requires_verification: response.data.requires_verification });
            }
        } catch (error) {
            dispatch({
                type: AUTH_ACTIONS.CHECK_AUTH,
                payload: {
                    user: null,
                    isAuthenticated: false,
                    tokenExpiry: null
                }
            });
        }
    };

    const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string, requires_verification: boolean; }> => {
        try {
            dispatch({ type: AUTH_ACTIONS.LOGIN_START });

            const response = await apiService.login(credentials);
            const tokenExpiry = Date.now() + (response.data.expires_in * 1000);

            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: {
                    user: response.data.user,
                    tokenExpiry
                }
            });

            return { success: true, requires_verification: response.data.requires_verification ?? false };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            dispatch({
                type: AUTH_ACTIONS.LOGIN_FAILURE,
                payload: { error: errorMessage }
            });
            return { success: false, error: errorMessage, requires_verification: false };
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await apiService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            tokenManager.clearRefreshTimer();
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
    };

    const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
        try {
            dispatch({ type: AUTH_ACTIONS.LOGIN_START });

            const response = await apiService.register(userData);
            const tokenExpiry = Date.now() + (response.data.expires_in * 1000);

            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: {
                    user: response.data.user,
                    tokenExpiry
                }
            });

            return { success: true };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';
            dispatch({
                type: AUTH_ACTIONS.LOGIN_FAILURE,
                payload: { error: errorMessage }
            });
            return { success: false, error: errorMessage };
        }
    };

    // Protected API call wrapper
    const authenticatedRequest = async<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
        try {
            return await apiService.request(endpoint, options);
        } catch (error) {
            if (error instanceof Error && error.message === 'TOKEN_EXPIRED') {
                // Try to refresh token
                try {
                    await tokenManager.handleTokenRefresh();
                    // Retry the original request
                    return await apiService.request(endpoint, options);
                } catch (refreshError) {
                    // If refresh fails, logout user
                    dispatch({ type: AUTH_ACTIONS.LOGOUT });
                    throw new Error('Session expired. Please login again.');
                }
            }
            throw error;
        }
    };

    const hasRole = (roleName: string): boolean => {
        return state.user?.role === roleName;
    }

    const hasGlobalPermission = (permissionName: string): boolean => {
        return state.user?.permissions?.global?.includes(permissionName) || false;
    }

    const hasSpecificPermission = (taskId: number, permissionName: keyof TaskSpecificPermission["permissions"], user?: User | null | undefined): boolean => {
        const User = user ?? state.user;
        const task = User?.permissions?.specific?.find(t => t.task_id === taskId);
        console.log("Checking specific permission for taskId:", taskId, "and permissionName:", permissionName, "user array:", User);
        console.log("Task found:", task);
        return task?.permissions[permissionName] || false;
    }



    const value: AuthContextType = {
        ...state,
        login,
        logout,
        register,
        checkAuthStatus,
        authenticatedRequest,
        dispatch,
        hasRole,
        hasGlobalPermission,
        hasSpecificPermission,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};