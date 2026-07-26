import React from 'react';
import classNames from 'classnames';

const OPCIONES = [
  { value: '', label: 'Todas' },
  { value: 'ingreso', label: 'Ingresos' },
  { value: 'gasto', label: 'Gastos' },
];

export default function TransactionFilters({ filtroTipo, onCambiarFiltro }) {
  return (
    <div className="flex gap-2">
      {OPCIONES.map((opcion) => (
        <button
          key={opcion.value}
          onClick={() => onCambiarFiltro(opcion.value)}
          className={classNames(
            'rounded-full px-3 py-1 text-xs font-medium transition-colors',
            filtroTipo === opcion.value
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          {opcion.label}
        </button>
      ))}
    </div>
  );
}
