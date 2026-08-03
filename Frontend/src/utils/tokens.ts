const ACCESS_TOKEN = "abber_access_token";
const REFRESH_TOKEN = "abber_refresh_token";

export const saveTokens = (
    accessToken: string,
    refreshToken: string
) => {

    localStorage.setItem(
        ACCESS_TOKEN,
        accessToken
    );

    localStorage.setItem(
        REFRESH_TOKEN,
        refreshToken
    );

};

export const getAccessToken = () =>
    localStorage.getItem(ACCESS_TOKEN);

export const getRefreshToken = () =>
    localStorage.getItem(REFRESH_TOKEN);

export const removeTokens = () => {

    localStorage.removeItem(ACCESS_TOKEN);

    localStorage.removeItem(REFRESH_TOKEN);

};

export const isAuthenticated = () =>
    !!getAccessToken();