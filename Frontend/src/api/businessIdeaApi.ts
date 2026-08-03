import api from "./axios";

export type ExecutionStage = "IDEATION" | "VALIDATION" | "MVP_LAUNCH" | "SCALING";

export interface BusinessIdea {
  id: number;
  title: string;
  elevatorPitch: string;
  detailedDescription?: string | null;
  targetMarket?: string | null;
  uniqueValueProposition?: string | null;
  executionStage: ExecutionStage;
  estimatedStartupCost?: number | null;
  projectedMonthlyRevenue?: number | null;
  projectedMonthlyExpenses?: number | null;
  isPublicShowcase?: boolean;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type MilestoneStatus = "LOCKED" | "IN_PROGRESS" | "SUBMITTED_FOR_REVIEW" | "COMPLETED";

export interface Milestone {
  id: number;
  sequenceOrder: number;
  taskTitle: string;
  taskDescription: string;
  status: MilestoneStatus;
  mentorNotes?: string | null;
  dueDate?: string | null;
  completedAt?: string | null;
}

export interface BusinessRoadmap {
  id: number;
  businessIdeaId: number;
  overallCompletionPercentage: number;
  currentPhase: ExecutionStage;
  startedAt?: string | null;
  expectedCompletionDate?: string | null;
  completedAt?: string | null;
  lastActivityAt?: string | null;
  milestones: Milestone[];
}

export interface RecentActivity {
  action: string;
  detail?: string | null;
  timestamp: string;
}

export interface DashboardSummary {
  activeIdeasCount: number;
  completedMilestonesCount: number;
  totalMilestonesCount: number;
  overallProgress: number;
  mentorName?: string | null;
  mentorSpecialty?: string | null;
  latestIdea?: BusinessIdea | null;
  latestRoadmap?: BusinessRoadmap | null;
  recentActivity: RecentActivity[];
}

export interface CreateIdeaPayload {
  title: string;
  elevatorPitch: string;
  detailedDescription?: string;
  targetMarket?: string;
  uniqueValueProposition?: string;
  executionStage: ExecutionStage;
  estimatedStartupCost?: number;
  projectedMonthlyRevenue?: number;
  projectedMonthlyExpenses?: number;
  isPublicShowcase?: boolean;
}

export interface CreateMilestonePayload {
  sequenceOrder: number;
  taskTitle: string;
  taskDescription: string;
  dueDate?: string;
}

export const getMyIdeas = async (): Promise<BusinessIdea[]> => {
  const response = await api.get<BusinessIdea[]>("/ideas");
  return response.data;
};

export const createIdea = async (payload: CreateIdeaPayload): Promise<BusinessIdea> => {
  const response = await api.post<BusinessIdea>("/ideas", payload);
  return response.data;
};

export const updateIdea = async (ideaId: number, payload: CreateIdeaPayload): Promise<BusinessIdea> => {
  const response = await api.put<BusinessIdea>(`/ideas/${ideaId}`, payload);
  return response.data;
};

export const getRoadmap = async (ideaId: number): Promise<BusinessRoadmap> => {
  const response = await api.get<BusinessRoadmap>(`/ideas/${ideaId}/roadmap`);
  return response.data;
};

export const createRoadmap = async (ideaId: number): Promise<BusinessRoadmap> => {
  const response = await api.post<BusinessRoadmap>(`/ideas/${ideaId}/roadmap`);
  return response.data;
};

export const addMilestone = async (
  roadmapId: number,
  payload: CreateMilestonePayload
): Promise<Milestone> => {
  const response = await api.post<Milestone>(`/roadmaps/${roadmapId}/milestones`, payload);
  return response.data;
};

export const updateMilestoneStatus = async (
  milestoneId: number,
  status: MilestoneStatus
): Promise<Milestone> => {
  const response = await api.patch<Milestone>(`/milestones/${milestoneId}/status`, { status });
  return response.data;
};

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await api.get<DashboardSummary>("/dashboard/summary");
  return response.data;
};
