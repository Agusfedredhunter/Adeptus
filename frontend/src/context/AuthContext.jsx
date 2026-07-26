import React, { createContext, useEffect, useState, useCallback } from 'react';
import authService from '../services/authService';
import { tokenStorage } from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    const restaurarSesion = async () => {
      const token = tokenStorage.get();
      if (!token) {
        setCargandoSesion(false);
        return;
      }
      try {
        const usuarioActual = await authService.me();
        setUser(usuarioActual);
      } catch (error) {
        tokenStorage.clear();
      } finally {
        setCargandoSesion(false);
      }
    };
    restaurarSesion();
  }, []);

  const login = useCallback(async (credenciales) => {
    const { user: usuarioLogueado, token } = await authService.login(credenciales);
    tokenStorage.set(token);
    setUser(usuarioLogueado);
    return usuarioLogueado;
  }, []);

  const register = useCallback(async (datos) => {
    const { user: usuarioCreado, token } = await authService.register(datos);
    tokenStorage.set(token);
    setUser(usuarioCreado);
    return usuarioCreado;
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    cargandoSesion,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
