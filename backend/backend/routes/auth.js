const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/authController');
const { verificarToken } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);

router.get('/me', verificarToken, me);

module.exports = router;
