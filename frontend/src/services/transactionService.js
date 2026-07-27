import api from './api';

const transactionService = {
  async listar(filtros = {}) {
    const { data } = await api.get('/transactions', { params: filtros });
    return data.transactions;
  },

  async crear(transaccion) {
    const { data } = await api.post('/transactions', transaccion);
    return data.transaction;
  },

  async actualizar(id, transaccion) {
    const { data } = await api.put(`/transactions/${id}`, transaccion);
    return data.transaction;
  },

  async eliminar(id) {
    const { data } = await api.delete(`/transactions/${id}`);
    return data;
  },

  async balance() {
    const { data } = await api.get('/transactions/balance');
    return data;
  },
};

export default transactionService;
