const jwt = require('jsonwebtoken');

const formatearMonto = (monto) => {
  return parseFloat(monto).toFixed(2);
};

const formatearFecha = (fecha) => {
  return new Date(fecha).toISOString().split('T')[0];
};

const generarToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

module.exports = { formatearMonto, formatearFecha, generarToken };
