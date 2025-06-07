import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  role?: 'manager' | 'engineer';
  children: ReactNode;
}

export default function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) return <Navigate to="/" />;

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

