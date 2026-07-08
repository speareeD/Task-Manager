import { useEffect, useState } from 'react';
import { me } from '@/services/authService';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const result = await me();
        setUser(result);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}
