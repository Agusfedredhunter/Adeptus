import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function RegisterPage() {
  const { register: registrarUsuario } = useAuth();
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (datos) => {
    setEnviando(true);
    try {
      await registrarUsuario(datos);
      toast.success('¡Cuenta creada con éxito!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo completar el registro');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-sm">
        <h1 className="mb-1 text-xl font-bold text-gray-900">Crear cuenta</h1>
        <p className="mb-6 text-sm text-gray-500">Empezá a organizar tus finanzas</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            id="nombre"
            label="Nombre"
            placeholder="Tu nombre completo"
            error={errors.nombre?.message}
            {...register('nombre', {
              required: 'El nombre es requerido',
              minLength: { value: 2, message: 'El nombre es demasiado corto' },
            })}
          />
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
            placeholder="Mínimo 6 caracteres"
            error={errors.password?.message}
            {...register('password', {
              required: 'La contraseña es requerida',
              minLength: { value: 6, message: 'Debe tener al menos 6 caracteres' },
            })}
          />
          <Input
            id="confirmarPassword"
            type="password"
            label="Confirmar contraseña"
            placeholder="Repetí tu contraseña"
            error={errors.confirmarPassword?.message}
            {...register('confirmarPassword', {
              required: 'Confirmá tu contraseña',
              validate: (valor) => valor === password || 'Las contraseñas no coinciden',
            })}
          />
          <Button type="submit" disabled={enviando} className="mt-2 w-full">
            {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </Card>
    </div>
  );
}
