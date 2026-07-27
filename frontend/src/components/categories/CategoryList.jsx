import React from 'react';
import CategoryBadge from './CategoryBadge';
import Button from '../ui/Button';

export default function CategoryList({ categories, onEliminar }) {
  if (categories.length === 0) {
    return <p className="text-sm text-gray-500">Todavía no hay categorías cargadas.</p>;
  }

  const ingresos = categories.filter((c) => c.tipo === 'ingreso');
  const gastos = categories.filter((c) => c.tipo === 'gasto');

  const renderGrupo = (titulo, items) => (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">{titulo}</h3>
      <ul className="flex flex-col gap-2">
        {items.map((categoria) => (
          <li
            key={categoria.id}
            className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
          >
            <CategoryBadge category={categoria} />
            <Button variant="ghost" onClick={() => onEliminar(categoria.id)} className="text-red-500 hover:bg-red-50">
              Eliminar
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {renderGrupo('Ingresos', ingresos)}
      {renderGrupo('Gastos', gastos)}
    </div>
  );
}
