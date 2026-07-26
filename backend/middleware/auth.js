const jwt = require('jsonwebtoken');
const { User } = require('../models');

const verificarToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No se proporcionó un token de autenticación' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No se proporcionó un token de autenticación' });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'El token ha expirado' });
      }
      return res.status(401).json({ error: 'Token inválido' });
    }

    const user = await User.findByPk(payload.id);

    if (!user) {
      return res.status(401).json({ error: 'El usuario del token ya no existe' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error en verificarToken:', error);
    res.status(500).json({ error: 'Error al verificar la autenticación' });
  }
};

module.exports = { verificarToken };
