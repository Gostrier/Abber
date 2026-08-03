import api from "./axios";

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
    phoneNumber?: string;
    county?: string;
    town?: string;
    skills?: string[];
}

export interface AuthResponse {
    accessToken?: string;
    refreshToken?: string;
    tokenType?: string;
    userId?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    roles?: string[];
    message?: string;
}

export const loginRequest = async (
    request: LoginRequest
): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
        "/auth/login",
        request
    );

    return response.data;
};

export const registerRequest = async (
    request: RegisterRequest
): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
        "/auth/register",
        request
    );

    return response.data;
};

export const refreshTokenRequest = async (
    refreshToken: string
): Promise<AuthResponse> => {

    const response = await api.post<AuthResponse>(
        "/auth/refresh",
        {
            refreshToken,
        }
    );

    return response.data;
};

export const resendVerification = async (
    email: string
): Promise<void> => {

    await api.post(
        "/auth/resend-verification",
        {
            email,
        }
    );

};

export const logoutRequest = async (
    refreshToken: string
): Promise<void> => {

    await api.post(
        "/auth/logout",
        {
            refreshToken,
        }
    );

};

export const forgotPasswordRequest = async (
    email: string
): Promise<void> => {

    await api.post(
        "/auth/forgot-password",
        {
            email,
        }
    );

};

export const resetPasswordRequest = async (
    token: string,
    newPassword: string,
    confirmPassword: string
): Promise<void> => {

    await api.post(
        "/auth/reset-password",
        {
            token,
            newPassword,
            confirmPassword,
        }
    );

};