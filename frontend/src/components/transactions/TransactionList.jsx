import React from 'react';
import TransactionItem from './TransactionItem';

export default function TransactionList({ transactions, onEliminar }) {
  if (transactions.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-gray-500">
        Todavía no cargaste ninguna transacción.
      </p>
    );
  }

  return (
    <ul>
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} onEliminar={onEliminar} />
      ))}
    </ul>
  );
}
