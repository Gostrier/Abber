import api from "./axios";

export interface StageCount {
    stage: string;
    count: number;
}

export interface DailyCount {
    date: string;
    count: number;
}

export interface AdminStatsResponse {
    totalUsers: number;
    totalMentors: number;
    totalMentees: number;
    totalAdmins: number;
    totalIdeas: number;
    totalRoadmaps: number;
    totalMilestones: number;
    completedMilestones: number;
    registrationsToday: number;
    loginsToday: number;
    averageProgress: number;
    ideasByStage: StageCount[];
    registrationsLast7Days: DailyCount[];
}

export interface AdminUserResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
    isActive: boolean;
    emailVerified: boolean;
    lastLoginAt: string | null;
    createdAt: string | null;
    ideasCount: number;
    totalMilestones: number;
    completedMilestones: number;
    progress: number;
}

export interface ActivityLogResponse {
    id: number;
    userId: number | null;
    userEmail: string | null;
    action: string;
    detail: string | null;
    timestamp: string;
}

export interface MilestoneInfo {
    id: number;
    sequenceOrder: number;
    taskTitle: string;
    taskDescription: string;
    status: string;
    mentorNotes: string | null;
    dueDate: string | null;
    completedAt: string | null;
}

export interface BusinessIdeaInfo {
    id: number;
    title: string;
    elevatorPitch: string;
    detailedDescription: string | null;
    targetMarket: string | null;
    uniqueValueProposition: string | null;
    executionStage: string;
    estimatedStartupCost: number | null;
    projectedMonthlyRevenue: number | null;
    projectedMonthlyExpenses: number | null;
    isPublicShowcase: boolean;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface BusinessRoadmapInfo {
    id: number;
    businessIdeaId: number;
    overallCompletionPercentage: number;
    currentPhase: string;
    startedAt: string | null;
    expectedCompletionDate: string | null;
    completedAt: string | null;
    lastActivityAt: string;
    milestones: MilestoneInfo[];
}

export interface IdeaProgress {
    idea: BusinessIdeaInfo;
    roadmap: BusinessRoadmapInfo | null;
}

export interface UserProgressResponse {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
    overallProgress: number;
    ideas: IdeaProgress[];
}

export type RoleAction = "GRANT" | "REVOKE";

export const getAdminStats = async (): Promise<AdminStatsResponse> => {
    const response = await api.get<AdminStatsResponse>("/admin/stats");
    return response.data;
};

export const getActivityLogs = async (): Promise<ActivityLogResponse[]> => {
    const response = await api.get<ActivityLogResponse[]>("/admin/activity-logs");
    return response.data;
};

export const getAdminUsers = async (): Promise<AdminUserResponse[]> => {
    const response = await api.get<AdminUserResponse[]>("/admin/users");
    return response.data;
};

export const getAdminUserProgress = async (
    userId: number
): Promise<UserProgressResponse> => {
    const response = await api.get<UserProgressResponse>(
        `/admin/users/${userId}/progress`
    );
    return response.data;
};

export const updateUserRole = async (
    userId: number,
    roleName: string,
    action: RoleAction
): Promise<void> => {
    await api.post(`/admin/users/${userId}/roles`, {
        roleName,
        action,
    });
};
