import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

const enlaces = [
  { to: '/', label: 'Dashboard' },
  { to: '/categorias', label: 'Categorías' },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <span className="text-lg font-semibold text-primary-700">💰 Mis Finanzas</span>
          {isAuthenticated && (
            <div className="flex gap-1">
              {enlaces.map((enlace) => (
                <NavLink
                  key={enlace.to}
                  to={enlace.to}
                  end={enlace.to === '/'}
                  className={({ isActive }) =>
                    classNames(
                      'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    )
                  }
                >
                  {enlace.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Hola, {user?.nombre?.split(' ')[0]}</span>
            <Button variant="ghost" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
}
