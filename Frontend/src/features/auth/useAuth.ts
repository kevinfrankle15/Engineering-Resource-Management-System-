import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';

export default function useAuth(requiredRole?: 'manager' | 'engineer') {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    } else if (requiredRole && user.role !== requiredRole) {
      navigate('/');
    }
  }, [user, requiredRole, navigate]);

  return user;
}
