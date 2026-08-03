import api from "./axios";

import type {
    AdminUserResponse,
    UserProgressResponse,
} from "./adminApi";

export const getMentorUsers = async (): Promise<AdminUserResponse[]> => {
    const response = await api.get<AdminUserResponse[]>("/mentor/users");
    return response.data;
};

export const getMentorUserProgress = async (
    userId: number
): Promise<UserProgressResponse> => {
    const response = await api.get<UserProgressResponse>(
        `/mentor/users/${userId}/progress`
    );
    return response.data;
};
