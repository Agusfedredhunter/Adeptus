export function formatearMoneda(monto) {
  const numero = typeof monto === 'string' ? parseFloat(monto) : monto;
  if (Number.isNaN(numero)) return '$0,00';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(numero);
}

export function formatearFecha(fecha) {
  if (!fecha) return '';
  const [year, month, day] = fecha.split('-');
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function fechaHoy() {
  return new Date().toISOString().split('T')[0];
}
