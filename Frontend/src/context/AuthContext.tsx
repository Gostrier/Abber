import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import type { ReactNode } from "react";

import {
    loginRequest,
    registerRequest,
    logoutRequest,
} from "../api/authApi";

import type {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
} from "../api/authApi";

import { getMe } from "../api/userApi";
import type { UserProfile } from "../api/userApi";

import {
    saveTokens,
    getAccessToken,
    getRefreshToken,
    removeTokens,
    isAuthenticated,
} from "../utils/tokens";

interface User {
    email: string;
    firstName?: string;
    lastName?: string;
    roles: string[];
    county?: string;
    town?: string;
    skills?: string;
}

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    authenticated: boolean;
    loading: boolean;

    login: (request: LoginRequest) => Promise<void>;
    register: (request: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;

    updateTokens: (
        accessToken: string,
        refreshToken: string
    ) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
    children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {

    const [user, setUser] = useState<User | null>(null);

    const [accessToken, setAccessToken] =
        useState<string | null>(getAccessToken());

    const [refreshToken, setRefreshToken] =
        useState<string | null>(getRefreshToken());

    const [loading, setLoading] = useState(true);

    const refreshProfile = async () => {
        try {
            const profile: UserProfile = await getMe();

            setUser({
                email: profile.email,
                firstName: profile.firstName,
                lastName: profile.lastName,
                roles: profile.roles ?? [],
                county: profile.county ?? undefined,
                town: profile.town ?? undefined,
                skills: profile.skills ?? undefined,
            });
        } catch (error) {
            console.error("Failed to load profile", error);
            removeTokens();
            setAccessToken(null);
            setRefreshToken(null);
            setUser(null);
        }
    };

    useEffect(() => {

        if (isAuthenticated()) {

            setAccessToken(getAccessToken());

            setRefreshToken(getRefreshToken());

            refreshProfile().finally(() => setLoading(false));

        } else {

            setLoading(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateTokens = (
        newAccessToken: string,
        newRefreshToken: string
    ) => {

        saveTokens(
            newAccessToken,
            newRefreshToken
        );

        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
    };

    const login = async (
        request: LoginRequest
    ) => {

        const response: AuthResponse =
            await loginRequest(request);

        updateTokens(
            response.accessToken!,
            response.refreshToken!
        );

        setUser({
            email: response.email ?? "",
            firstName: response.firstName,
            lastName: response.lastName,
            roles: response.roles ?? [],
        });
    };

    const register = async (
        request: RegisterRequest
    ) => {

        const response: AuthResponse =
            await registerRequest(request);

        if (response.accessToken) {
            updateTokens(
                response.accessToken,
                response.refreshToken!
            );

            setUser({
                email: response.email ?? "",
                roles: response.roles ?? [],
            });
        }
    };

    const logout = async () => {

        try {

            if (refreshToken) {

                await logoutRequest(refreshToken);

            }

        } catch (error) {

            console.error(error);

        } finally {

            removeTokens();

            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
        }
    };

    const value = useMemo(
        () => ({
            user,
            accessToken,
            refreshToken,
            authenticated: !!accessToken,
            loading,
            login,
            register,
            logout,
            refreshProfile,
            updateTokens,
        }),
        [
            user,
            accessToken,
            refreshToken,
            loading,
        ]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {

    const context = useContext(AuthContext);

    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider."
        );
    }

    return context;
};
