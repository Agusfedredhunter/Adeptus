import api from './api';

const categoryService = {
  async listar() {
    const { data } = await api.get('/categories');
    return data.categories;
  },

  async crear(categoria) {
    const { data } = await api.post('/categories', categoria);
    return data.category;
  },

  async actualizar(id, categoria) {
    const { data } = await api.put(`/categories/${id}`, categoria);
    return data.category;
  },

  async eliminar(id) {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  },
};

export default categoryService;
