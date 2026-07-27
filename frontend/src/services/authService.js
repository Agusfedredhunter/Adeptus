import api from './api';

const authService = {
  async register({ nombre, email, password }) {
    const { data } = await api.post('/auth/register', { nombre, email, password });
    return data;
  },

  async login({ email, password }) {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  async me() {
    const { data } = await api.get('/auth/me');
    return data.user;
  },
};

export default authService;
