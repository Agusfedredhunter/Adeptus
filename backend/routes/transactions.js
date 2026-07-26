const express = require('express');
const router = express.Router();
const { validarTransaccion, crear, listar, balance, actualizar, eliminar } = require('../controllers/transactionController');
const { verificarToken } = require('../middleware/auth');

router.use(verificarToken);

router.post('/', validarTransaccion, crear);
router.get('/', listar);
router.get('/balance', balance);
router.put('/:id', actualizar);
router.delete('/:id', eliminar);

module.exports = router;
