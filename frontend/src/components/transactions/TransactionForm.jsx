import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { fechaHoy } from '../../utils/formatters';

export default function TransactionForm({ categories, onSubmit, enviando }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tipo: 'gasto',
      monto: '',
      descripcion: '',
      fecha: fechaHoy(),
      categoryId: '',
    },
  });

  const tipoSeleccionado = watch('tipo');
  const categoriasFiltradas = categories.filter((c) => c.tipo === tipoSeleccionado);

  const enviar = async (datos) => {
    await onSubmit({ ...datos, monto: parseFloat(datos.monto), categoryId: Number(datos.categoryId) });
    reset({ tipo: datos.tipo, monto: '', descripcion: '', fecha: fechaHoy(), categoryId: '' });
  };

  return (
    <form onSubmit={handleSubmit(enviar)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Select id="tipo" label="Tipo" {...register('tipo', { required: true })}>
        <option value="gasto">Gasto</option>
        <option value="ingreso">Ingreso</option>
      </Select>

      <Input
        id="monto"
        type="number"
        step="0.01"
        min="0.01"
        label="Monto"
        placeholder="0.00"
        error={errors.monto?.message}
        {...register('monto', {
          required: 'El monto es requerido',
          min: { value: 0.01, message: 'El monto debe ser mayor a 0' },
        })}
      />

      <Select
        id="categoryId"
        label="Categoría"
        error={errors.categoryId?.message}
        {...register('categoryId', { required: 'Elegí una categoría' })}
      >
        <option value="">Seleccionar…</option>
        {categoriasFiltradas.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nombre}
          </option>
        ))}
      </Select>

      <Input
        id="fecha"
        type="date"
        label="Fecha"
        error={errors.fecha?.message}
        {...register('fecha', { required: 'La fecha es requerida' })}
      />

      <div className="sm:col-span-2">
        <Input id="descripcion" label="Descripción (opcional)" placeholder="Ej: Supermercado" {...register('descripcion')} />
      </div>

      <div className="sm:col-span-2">
        <Button type="submit" disabled={enviando} className="w-full sm:w-auto">
          {enviando ? 'Guardando…' : 'Agregar transacción'}
        </Button>
      </div>
    </form>
  );
}
