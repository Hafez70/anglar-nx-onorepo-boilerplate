import { IProfileEntity } from "@profile";

export interface AuthResponse {
  profile: IProfileEntity;
  token: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}