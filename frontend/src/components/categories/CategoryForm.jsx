import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

export default function CategoryForm({ onSubmit, enviando }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { nombre: '', tipo: 'gasto', color: '#3B82F6' },
  });

  const enviar = async (datos) => {
    await onSubmit(datos);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(enviar)} className="flex flex-wrap items-end gap-3">
      <div className="min-w-[180px] flex-1">
        <Input
          id="nombre"
          label="Nombre"
          placeholder="Ej: Suscripciones"
          error={errors.nombre?.message}
          {...register('nombre', { required: 'El nombre es requerido' })}
        />
      </div>

      <Select id="tipo" label="Tipo" {...register('tipo', { required: true })}>
        <option value="gasto">Gasto</option>
        <option value="ingreso">Ingreso</option>
      </Select>

      <div className="flex flex-col gap-1">
        <label htmlFor="color" className="text-sm font-medium text-gray-700">
          Color
        </label>
        <input
          id="color"
          type="color"
          className="h-[38px] w-14 cursor-pointer rounded-lg border border-gray-300"
          {...register('color')}
        />
      </div>

      <Button type="submit" disabled={enviando}>
        {enviando ? 'Guardando…' : 'Agregar categoría'}
      </Button>
    </form>
  );
}
