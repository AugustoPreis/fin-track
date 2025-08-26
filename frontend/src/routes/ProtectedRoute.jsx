import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../providers/AuthProvider';

export default function ProtectedRoute() {
  const [interceptor, setInterceptor] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use((response) => response, (error) => {
      // Unauthorized
      if (error.response?.status === 401) {
        logout();
      }

      return Promise.reject(error);
    });

    setInterceptor(interceptor);
  }, []);

  const logout = () => {
    auth.logout();
    navigate('/login');
  }

  if (!auth.isAuthenticated()) {
    return (
      <Navigate to='/login' />
    );
  }

  if (interceptor === null) {
    return null;
  }

  return (
    <Outlet />
  );
}