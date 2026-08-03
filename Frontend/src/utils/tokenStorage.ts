const ACCESS_TOKEN = "abber_access_token";
const REFRESH_TOKEN = "abber_refresh_token";

export const tokenStorage = {
    getAccessToken: () => localStorage.getItem(ACCESS_TOKEN),

    getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN),

    setTokens: (access: string, refresh: string) => {
        localStorage.setItem(ACCESS_TOKEN, access);
        localStorage.setItem(REFRESH_TOKEN, refresh);
    },

    clear: () => {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
    }
};