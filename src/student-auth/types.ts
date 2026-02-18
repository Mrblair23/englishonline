export interface StudentUser {
  id: string;
  email: string;
  role: "student";
  emailVerified: boolean;
}

export interface LoginResponse {
  token?: string;
  user?: StudentUser;
  requiresEmailVerification?: boolean;
  message?: string;
}

export interface SignupResponse {
  requiresEmailVerification?: boolean;
  message?: string;
  token?: string;
  user?: StudentUser;
}
