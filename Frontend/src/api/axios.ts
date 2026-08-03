import axios from "axios";

import {
    getAccessToken,
    getRefreshToken,
    saveTokens,
    removeTokens,
} from "../utils/tokens";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

const api = axios.create({

    baseURL: API_URL,

    headers: {
        "Content-Type": "application/json",
    },

});

let isRefreshing = false;

let failedQueue: any[] = [];

const processQueue = (
    error: any,
    token: string | null = null
) => {

    failedQueue.forEach((promise) => {

        if (error) {

            promise.reject(error);

        } else {

            promise.resolve(token);

        }

    });

    failedQueue = [];

};

api.interceptors.request.use(

    (config) => {

        const token = getAccessToken();

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        return config;

    },

    (error) => Promise.reject(error)

);

api.interceptors.response.use(

    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        if (

            error.response?.status === 401 &&
            !originalRequest._retry

        ) {

            if (isRefreshing) {

                return new Promise((resolve, reject) => {

                    failedQueue.push({
                        resolve,
                        reject,
                    });

                }).then((token) => {

                    originalRequest.headers.Authorization =
                        `Bearer ${token}`;

                    return api(originalRequest);

                });

            }

            originalRequest._retry = true;

            isRefreshing = true;

            try {

                const refreshToken = getRefreshToken();

                const response = await axios.post(

                    `${API_URL}/auth/refresh`,

                    {

                        refreshToken,

                    }

                );

                const {

                    accessToken,

                    refreshToken: newRefresh,

                } = response.data;

                saveTokens(
                    accessToken,
                    newRefresh
                );

                api.defaults.headers.common.Authorization =
                    `Bearer ${accessToken}`;

                processQueue(
                    null,
                    accessToken
                );

                originalRequest.headers.Authorization =
                    `Bearer ${accessToken}`;

                return api(originalRequest);

            }

            catch (err) {

                processQueue(err);

                removeTokens();

                window.location.href = "/login";

                return Promise.reject(err);

            }

            finally {

                isRefreshing = false;

            }

        }

        return Promise.reject(error);

    }

);

export default api;