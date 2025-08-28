import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const ProtectedRoute = lazy(() => import('./ProtectedRoute'));
const PremiumRoute = lazy(() => import('./PremiumRoute'));

const Login = lazy(() => import('../pages/usuario/Login'));
const Cadastro = lazy(() => import('../pages/usuario/Cadastro'));
const Extrato = lazy(() => import('../pages/transacao/extrato/Extrato'));
const Categoria = lazy(() => import('../pages/categoria/Categoria'));
const Analise = lazy(() => import('../pages/analise/Analise'));

export default function AppRouter() {
  const router = createBrowserRouter([
    {
      index: true,
      element: <Login />,
    },
    {
      path: 'login',
      element: <Login />,
    },
    {
      path: 'cadastro',
      element: <Cadastro />,
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          index: true,
          element: <Extrato />,
        },
        {
          path: '/transacoes',
          element: <Extrato />,
        },
        {
          path: '/categorias',
          element: <Categoria />,
        },
        {
          element: <PremiumRoute />,
          children: [
            {
              path: '/analises',
              element: <Analise />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}