import api from "./axios";

import type { MentorProfile } from "./mentorApi";

export const getPublicMentors = async (): Promise<MentorProfile[]> => {
    const response = await api.get<MentorProfile[]>("/public/mentors");
    return response.data;
};

export const getPublicMentor = async (
    mentorId: number
): Promise<MentorProfile> => {
    const response = await api.get<MentorProfile>(`/public/mentors/${mentorId}`);
    return response.data;
};
