export interface AuthUser {
  id: string;
  username: string;
  role: string;
  name?: string;
  email?: string;
  avatar?: string;
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
  message?: string;
}

