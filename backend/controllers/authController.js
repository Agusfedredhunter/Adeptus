const { User } = require('../models');
const { generarToken } = require('../utils/helpers');

const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y password son requeridos' });
    }

    const existente = await User.findOne({ where: { email } });
    if (existente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const user = await User.create({ nombre, email, password });
    const token = generarToken(user);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user,
      token,
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map((e) => e.message).join(', ') });
    }
    console.error('Error en register:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son requeridos' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordValida = await user.validarPassword(password);

    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generarToken(user);

    res.json({
      message: 'Login exitoso',
      user,
      token,
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

const me = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, login, me };
