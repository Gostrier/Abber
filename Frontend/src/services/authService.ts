import api from "../api/axios";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    email: string;
    roles: string[];
}

const authService = {
    login: (data: LoginRequest) =>
        api.post<AuthResponse>("/auth/login", data),

    register: (data: RegisterRequest) =>
        api.post<AuthResponse>("/auth/register", data),

    refreshToken: (refreshToken: string) =>
        api.post<AuthResponse>("/auth/refresh", {
            refreshToken,
        }),

    logout: () =>
        api.post("/auth/logout")
};

export default authService;