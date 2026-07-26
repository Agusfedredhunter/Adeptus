import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (datos) => {
    setEnviando(true);
    try {
      await login(datos);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo iniciar sesión');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-sm">
        <h1 className="mb-1 text-xl font-bold text-gray-900">Iniciar sesión</h1>
        <p className="mb-6 text-sm text-gray-500">Accedé a tu resumen financiero</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="tu@email.com"
            error={errors.email?.message}
            {...register('email', { required: 'El email es requerido' })}
          />
          <Input
            id="password"
            type="password"
            label="Contraseña"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', { required: 'La contraseña es requerida' })}
          />
          <Button type="submit" disabled={enviando} className="mt-2 w-full">
            {enviando ? 'Ingresando…' : 'Ingresar'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          ¿No tenés cuenta?{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:underline">
            Registrate
          </Link>
        </p>
      </Card>
    </div>
  );
}
