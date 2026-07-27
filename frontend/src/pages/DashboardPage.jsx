import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import BalanceSummary from '../components/transactions/BalanceSummary';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionList from '../components/transactions/TransactionList';
import TransactionFilters from '../components/transactions/TransactionFilters';
import { useCategories } from '../hooks/useCategories';
import transactionService from '../services/transactionService';

export default function DashboardPage() {
  const { categories, cargando: cargandoCategorias } = useCategories();
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState('');

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      const filtros = filtroTipo ? { tipo: filtroTipo } : {};
      const [listaTransacciones, balanceActual] = await Promise.all([
        transactionService.listar(filtros),
        transactionService.balance(),
      ]);
      setTransactions(listaTransacciones);
      setBalance(balanceActual);
    } catch (error) {
      toast.error('No se pudieron cargar tus transacciones');
    } finally {
      setCargando(false);
    }
  }, [filtroTipo]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleCrear = async (datos) => {
    setEnviando(true);
    try {
      await transactionService.crear(datos);
      toast.success('Transacción agregada');
      await cargarDatos();
    } catch (error) {
      const mensaje = error.response?.data?.errores?.[0]?.msg || error.response?.data?.error;
      toast.error(mensaje || 'No se pudo guardar la transacción');
    } finally {
      setEnviando(false);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await transactionService.eliminar(id);
      toast.success('Transacción eliminada');
      await cargarDatos();
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo eliminar la transacción');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Resumen de tus ingresos y gastos</p>
      </div>

      <BalanceSummary balance={balance} />

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-gray-700">Nueva transacción</h2>
        {cargandoCategorias ? (
          <Spinner />
        ) : (
          <TransactionForm categories={categories} onSubmit={handleCrear} enviando={enviando} />
        )}
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Movimientos</h2>
          <TransactionFilters filtroTipo={filtroTipo} onCambiarFiltro={setFiltroTipo} />
        </div>
        {cargando ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : (
          <TransactionList transactions={transactions} onEliminar={handleEliminar} />
        )}
      </Card>
    </div>
  );
}
