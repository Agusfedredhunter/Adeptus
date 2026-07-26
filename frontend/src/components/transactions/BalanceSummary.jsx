import React from 'react';
import Card from '../ui/Card';
import { formatearMoneda } from '../../utils/formatters';

export default function BalanceSummary({ balance }) {
  if (!balance) return null;

  const items = [
    { label: 'Ingresos', valor: balance.ingresos, color: 'text-income' },
    { label: 'Gastos', valor: balance.gastos, color: 'text-expense' },
    {
      label: 'Balance',
      valor: balance.balance,
      color: parseFloat(balance.balance) >= 0 ? 'text-income' : 'text-expense',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label}>
          <p className="text-sm font-medium text-gray-500">{item.label}</p>
          <p className={`mt-1 text-2xl font-bold ${item.color}`}>{formatearMoneda(item.valor)}</p>
        </Card>
      ))}
    </div>
  );
}
