import api from "./axios";

export interface UserProfile {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  emailVerified: boolean;
  phoneNumber?: string | null;
  county?: string | null;
  town?: string | null;
  skills?: string | null;
  roles: string[];
  createdAt: string;
}

export const getMe = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>("/users/me");
  return response.data;
};
