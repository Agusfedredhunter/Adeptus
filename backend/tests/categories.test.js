const request = require('supertest');
const app = require('../server');
const { resetDb } = require('./setup');
const { sequelize } = require('../models');

let token;

beforeAll(async () => {
  await resetDb();
  const res = await request(app)
    .post('/api/auth/register')
    .send({ nombre: 'Categoria Tester', email: 'categorias@test.com', password: '123456' });
  token = res.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe('GET /api/categories', () => {
  it('debe listar las categorías sembradas sin requerir autenticación', async () => {
    const res = await request(app).get('/api/categories');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.categories)).toBe(true);
    expect(res.body.categories.length).toBeGreaterThanOrEqual(2);
  });
});

describe('POST /api/categories', () => {
  it('debe rechazar la creación sin token de autenticación', async () => {
    const res = await request(app)
      .post('/api/categories')
      .send({ nombre: 'Educación', tipo: 'gasto' });

    expect(res.statusCode).toBe(401);
  });

  it('debe crear una categoría cuando el usuario está autenticado', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Educación', tipo: 'gasto', color: '#111111' });

    expect(res.statusCode).toBe(201);
    expect(res.body.category.nombre).toBe('Educación');
  });

  it('debe rechazar la creación si faltan campos requeridos', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ color: '#222222' });

    expect(res.statusCode).toBe(400);
  });
});

describe('PUT /api/categories/:id', () => {
  let categoryId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Mascotas', tipo: 'gasto' });
    categoryId = res.body.category.id;
  });

  it('debe rechazar la actualización sin token', async () => {
    const res = await request(app)
      .put(`/api/categories/${categoryId}`)
      .send({ nombre: 'Mascotas y Veterinaria' });

    expect(res.statusCode).toBe(401);
  });

  it('debe actualizar una categoría existente', async () => {
    const res = await request(app)
      .put(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Mascotas y Veterinaria', tipo: 'gasto' });

    expect(res.statusCode).toBe(200);
    expect(res.body.category.nombre).toBe('Mascotas y Veterinaria');
  });

  it('debe devolver 404 al actualizar una categoría inexistente', async () => {
    const res = await request(app)
      .put('/api/categories/999999')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'No existe' });

    expect(res.statusCode).toBe(404);
  });
});

describe('DELETE /api/categories/:id', () => {
  it('debe eliminar una categoría existente', async () => {
    const creada = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Temporal', tipo: 'ingreso' });

    const res = await request(app)
      .delete(`/api/categories/${creada.body.category.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it('debe devolver 404 al eliminar una categoría inexistente', async () => {
    const res = await request(app)
      .delete('/api/categories/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});
