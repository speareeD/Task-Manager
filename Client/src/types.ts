export interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface ActivateAccountRequest {
  email: string;
  password: string;
}
