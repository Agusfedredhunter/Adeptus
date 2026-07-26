import React from 'react';
import CategoryBadge from '../categories/CategoryBadge';
import { formatearMoneda, formatearFecha } from '../../utils/formatters';

export default function TransactionItem({ transaction, onEliminar }) {
  const esIngreso = transaction.tipo === 'ingreso';

  return (
    <li className="flex items-center justify-between gap-4 border-b border-gray-100 py-3 last:border-b-0">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <CategoryBadge category={transaction.category} />
          <span className="text-xs text-gray-400">{formatearFecha(transaction.fecha)}</span>
        </div>
        {transaction.descripcion && (
          <p className="text-sm text-gray-600">{transaction.descripcion}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className={`text-sm font-semibold ${esIngreso ? 'text-income' : 'text-expense'}`}>
          {esIngreso ? '+' : '-'} {formatearMoneda(transaction.monto)}
        </span>
        <button
          onClick={() => onEliminar(transaction.id)}
          className="text-xs font-medium text-gray-400 hover:text-red-500"
          aria-label="Eliminar transacción"
        >
          Eliminar
        </button>
      </div>
    </li>
  );
}
