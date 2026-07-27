import React from 'react';

export default function Spinner({ className = 'h-6 w-6' }) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary-600 ${className}`}
      role="status"
      aria-label="Cargando"
    />
  );
}
