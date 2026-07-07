import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  nameid: string;
  unique_name: string;
  email: string;
  exp: number;
}

export function getCurrentUser() {
  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}
