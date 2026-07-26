import React from 'react';

export default function CategoryBadge({ category }) {
  if (!category) {
    return <span className="text-xs text-gray-400">Sin categoría</span>;
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ backgroundColor: `${category.color}20`, color: category.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: category.color }} />
      {category.nombre}
    </span>
  );
}
