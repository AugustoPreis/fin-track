import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const ProtectedRoute = lazy(() => import('./ProtectedRoute'));

const Login = lazy(() => import('../pages/usuario/Login'));
const Cadastro = lazy(() => import('../pages/usuario/Cadastro'));
const Extrato = lazy(() => import('../pages/transacao/extrato/Extrato'));
const Categoria = lazy(() => import('../pages/categoria/Categoria'));

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
      ],
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}