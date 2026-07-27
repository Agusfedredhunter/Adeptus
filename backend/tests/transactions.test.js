const request = require('supertest');
const app = require('../server');
const { resetDb } = require('./setup');
const { sequelize, Category } = require('../models');

let tokenUsuarioA;
let tokenUsuarioB;
let categoriaId;

beforeAll(async () => {
  await resetDb();

  const categoria = await Category.findOne({ where: { tipo: 'gasto' } });
  categoriaId = categoria.id;

  const usuarioA = await request(app)
    .post('/api/auth/register')
    .send({ nombre: 'Usuario A', email: 'usuarioA@test.com', password: '123456' });
  tokenUsuarioA = usuarioA.body.token;

  const usuarioB = await request(app)
    .post('/api/auth/register')
    .send({ nombre: 'Usuario B', email: 'usuarioB@test.com', password: '123456' });
  tokenUsuarioB = usuarioB.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe('POST /api/transactions', () => {
  it('debe rechazar la creación sin token', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .send({ monto: 100, tipo: 'gasto', fecha: '2026-01-01', categoryId: categoriaId });

    expect(res.statusCode).toBe(401);
  });

  it('debe rechazar datos inválidos (monto negativo)', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${tokenUsuarioA}`)
      .send({ monto: -10, tipo: 'gasto', fecha: '2026-01-01', categoryId: categoriaId });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errores');
  });

  it('debe rechazar una categoría inexistente', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${tokenUsuarioA}`)
      .send({ monto: 100, tipo: 'gasto', fecha: '2026-01-01', categoryId: 999999 });

    expect(res.statusCode).toBe(404);
  });

  it('debe crear una transacción asociada al usuario autenticado', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${tokenUsuarioA}`)
      .send({ monto: 500.5, tipo: 'gasto', descripcion: 'Compra semanal', fecha: '2026-01-05', categoryId: categoriaId });

    expect(res.statusCode).toBe(201);
    expect(res.body.transaction).toHaveProperty('id');
    expect(res.body.transaction.monto).toBe('500.50');
    expect(res.body.transaction.category.id).toBe(categoriaId);
  });
});

describe('Aislamiento de datos entre usuarios', () => {
  beforeAll(async () => {
    await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${tokenUsuarioA}`)
      .send({ monto: 1000, tipo: 'ingreso', fecha: '2026-01-10', categoryId: categoriaId });

    await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${tokenUsuarioB}`)
      .send({ monto: 200, tipo: 'gasto', fecha: '2026-01-11', categoryId: categoriaId });
  });

  it('el usuario A solo debe ver sus propias transacciones', async () => {
    const me = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${tokenUsuarioA}`);
    const idUsuarioA = me.body.user.id;

    const res = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${tokenUsuarioA}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.transactions.length).toBeGreaterThanOrEqual(2);
    expect(res.body.transactions.every((t) => t.userId === idUsuarioA)).toBe(true);
  });

  it('el usuario B no debe ver transacciones del usuario A', async () => {
    const res = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${tokenUsuarioB}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.transactions.length).toBe(1);
    expect(res.body.transactions[0].monto).toBe('200.00');
  });
});

describe('GET /api/transactions/balance', () => {
  it('debe calcular el balance solo con las transacciones del usuario autenticado', async () => {
    const res = await request(app)
      .get('/api/transactions/balance')
      .set('Authorization', `Bearer ${tokenUsuarioB}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.gastos).toBe('200.00');
    expect(res.body.ingresos).toBe('0.00');
    expect(res.body.balance).toBe('-200.00');
  });
});

describe('PUT /api/transactions/:id y DELETE /api/transactions/:id', () => {
  let transaccionDeA;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${tokenUsuarioA}`)
      .send({ monto: 50, tipo: 'gasto', fecha: '2026-02-01', categoryId: categoriaId });
    transaccionDeA = res.body.transaction.id;
  });

  it('debe devolver 404 al actualizar una transacción inexistente', async () => {
    const res = await request(app)
      .put('/api/transactions/999999')
      .set('Authorization', `Bearer ${tokenUsuarioA}`)
      .send({ monto: 60 });

    expect(res.statusCode).toBe(404);
  });

  it('debe rechazar con 403 si el usuario B intenta modificar una transacción de A', async () => {
    const res = await request(app)
      .put(`/api/transactions/${transaccionDeA}`)
      .set('Authorization', `Bearer ${tokenUsuarioB}`)
      .send({ monto: 999 });

    expect(res.statusCode).toBe(403);
  });

  it('debe rechazar con 403 si el usuario B intenta eliminar una transacción de A', async () => {
    const res = await request(app)
      .delete(`/api/transactions/${transaccionDeA}`)
      .set('Authorization', `Bearer ${tokenUsuarioB}`);

    expect(res.statusCode).toBe(403);
  });

  it('debe permitir al dueño actualizar su transacción', async () => {
    const res = await request(app)
      .put(`/api/transactions/${transaccionDeA}`)
      .set('Authorization', `Bearer ${tokenUsuarioA}`)
      .send({ monto: 75, tipo: 'gasto', descripcion: 'Actualizada', fecha: '2026-02-01', categoryId: categoriaId });

    expect(res.statusCode).toBe(200);
    expect(res.body.transaction.monto).toBe('75.00');
  });

  it('debe permitir al dueño eliminar su transacción', async () => {
    const res = await request(app)
      .delete(`/api/transactions/${transaccionDeA}`)
      .set('Authorization', `Bearer ${tokenUsuarioA}`);

    expect(res.statusCode).toBe(200);
  });
});
