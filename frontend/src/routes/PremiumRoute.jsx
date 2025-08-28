import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

export default function PremiumRoute() {
  const auth = useAuth();

  if (!auth.user?.plano === 'PREMIUM') {
    return (
      <Navigate to='/transacoes' />
    );
  }

  return (
    <Outlet />
  );
}