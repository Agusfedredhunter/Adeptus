import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../ui/Spinner';

/**
 * Envuelve las rutas que requieren un usuario autenticado.
 * Mientras se restaura la sesión desde el token guardado muestra un
 * spinner; si no hay usuario, redirige a /login.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, cargandoSesion } = useAuth();

  if (cargandoSesion) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
