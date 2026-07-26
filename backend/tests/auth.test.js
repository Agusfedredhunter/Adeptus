const request = require('supertest');
const app = require('../server');
const { resetDb } = require('./setup');
const { sequelize } = require('../models');

beforeAll(async () => {
  await resetDb();
});

afterAll(async () => {
  await sequelize.close();
});

describe('POST /api/auth/register', () => {
  it('debe registrar un usuario y devolver un token JWT', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Usuario Test', email: 'usuario@test.com', password: '123456' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
    expect(res.body.user.email).toBe('usuario@test.com');
    // La contraseña nunca debe viajar en la respuesta
    expect(res.body.user.password).toBeUndefined();
  });

  it('no debe permitir registrar un email duplicado', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Otro Usuario', email: 'usuario@test.com', password: '123456' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('debe rechazar el registro si faltan campos requeridos', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'incompleto@test.com' });

    expect(res.statusCode).toBe(400);
  });

  it('debe rechazar un email con formato inválido', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Usuario Invalido', email: 'no-es-un-email', password: '123456' });

    expect(res.statusCode).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  it('debe loguear un usuario con credenciales válidas y devolver token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'usuario@test.com', password: '123456' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('token');
  });

  it('debe rechazar credenciales con password incorrecta', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'usuario@test.com', password: 'password-incorrecta' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('debe rechazar el login de un email no registrado', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'no-existe@test.com', password: '123456' });

    expect(res.statusCode).toBe(401);
  });

  it('debe rechazar el login si faltan campos', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'usuario@test.com' });

    expect(res.statusCode).toBe(400);
  });
});

describe('GET /api/auth/me (ruta protegida)', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'usuario@test.com', password: '123456' });
    token = res.body.token;
  });

  it('debe devolver el usuario autenticado cuando el token es válido', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe('usuario@test.com');
  });

  it('debe rechazar la petición si no se envía token', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.statusCode).toBe(401);
  });

  it('debe rechazar la petición si el header no tiene formato Bearer', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', token);

    expect(res.statusCode).toBe(401);
  });

  it('debe rechazar un token inválido', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer token.invalido.aca');

    expect(res.statusCode).toBe(401);
  });
});
