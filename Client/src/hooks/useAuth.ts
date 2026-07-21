import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface JwtPayload {
  nameid: string;
  unique_name: string;
  email: string;
  isAdmin: string;
  exp: number;
}

function getUserFromToken(): User | null {
  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  try {
    const payload = jwtDecode<JwtPayload>(token);

    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');

      return null;
    }

    return {
      id: payload.nameid,
      name: payload.unique_name,
      email: payload.email,
      isAdmin: payload.isAdmin === 'true',
    };
  } catch {
    localStorage.removeItem('token');

    return null;
  }
}

export function useAuth() {
  const [user] = useState<User | null>(getUserFromToken);

  return {
    user,
    isAuthenticated: !!user,
  };
}
