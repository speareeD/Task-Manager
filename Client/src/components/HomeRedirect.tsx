import { Navigate } from 'react-router-dom';
import { getToken } from '@/services/authService';

export default function HomeRedirect() {
  const token = getToken();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}
