import api from "./axios";

import type {
    AdminUserResponse,
    UserProgressResponse,
} from "./adminApi";
import type { Milestone } from "./businessIdeaApi";

export interface MentorProfile {
    mentorId: number;
    firstName: string;
    lastName: string;
    email: string;
    specialty: string | null;
    bio: string | null;
    yearsOfExperience: number | null;
    company: string | null;
    location: string | null;
    isAvailable: boolean;
    isFeatured: boolean;
    menteeCount: number;
    ideasMentored: number;
}

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

export const getMentorProfile = async (): Promise<MentorProfile> => {
    const response = await api.get<MentorProfile>("/mentor/profile");
    return response.data;
};

export const updateMilestoneNotes = async (
    milestoneId: number,
    notes: string
): Promise<Milestone> => {
    const response = await api.put<Milestone>(
        `/mentor/milestones/${milestoneId}/notes`,
        { notes }
    );
    return response.data;
};
