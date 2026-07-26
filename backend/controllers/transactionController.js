const { Transaction, Category } = require('../models');
const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');

const validarTransaccion = [
  body('monto').notEmpty().withMessage('El monto es requerido').isFloat({ min: 0.01 }).withMessage('El monto debe ser mayor a 0'),
  body('tipo').notEmpty().withMessage('El tipo es requerido').isIn(['ingreso', 'gasto']).withMessage('El tipo debe ser ingreso o gasto'),
  body('fecha').notEmpty().withMessage('La fecha es requerida').isDate().withMessage('La fecha no es válida'),
  body('categoryId').notEmpty().withMessage('La categoría es requerida').isInt().withMessage('La categoría debe ser un número entero'),
];

const crear = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const { monto, tipo, descripcion, fecha, categoryId } = req.body;

    const categoria = await Category.findByPk(categoryId);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    const transaction = await Transaction.create({
      monto,
      tipo,
      descripcion,
      fecha,
      categoryId,
      userId: req.user.id,
    });

    const resultado = await Transaction.findByPk(transaction.id, {
      include: [{ model: Category, as: 'category' }]
    });

    res.status(201).json({ message: 'Transacción creada exitosamente', transaction: resultado });
  } catch (error) {
    console.error('Error en crear:', error);
    res.status(500).json({ error: 'Error al crear transacción' });
  }
};

const listar = async (req, res) => {
  try {
    const { tipo, categoryId, fechaDesde, fechaHasta } = req.query;

    const where = { userId: req.user.id };

    if (tipo) where.tipo = tipo;
    if (categoryId) where.categoryId = categoryId;
    if (fechaDesde || fechaHasta) {
      where.fecha = {};
      if (fechaDesde) where.fecha[Op.gte] = fechaDesde;
      if (fechaHasta) where.fecha[Op.lte] = fechaHasta;
    }

    const transactions = await Transaction.findAll({
      where,
      include: [{ model: Category, as: 'category' }],
      order: [['fecha', 'DESC']]
    });

    res.json({ transactions });
  } catch (error) {
    console.error('Error en listar:', error);
    res.status(500).json({ error: 'Error al obtener transacciones' });
  }
};

const balance = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({ where: { userId: req.user.id } });

    const ingresos = transactions
      .filter(t => t.tipo === 'ingreso')
      .reduce((sum, t) => sum + parseFloat(t.monto), 0);

    const gastos = transactions
      .filter(t => t.tipo === 'gasto')
      .reduce((sum, t) => sum + parseFloat(t.monto), 0);

    res.json({
      ingresos: ingresos.toFixed(2),
      gastos: gastos.toFixed(2),
      balance: (ingresos - gastos).toFixed(2)
    });
  } catch (error) {
    console.error('Error en balance:', error);
    res.status(500).json({ error: 'Error al calcular balance' });
  }
};

const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { monto, tipo, descripcion, fecha, categoryId } = req.body;

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transacción no encontrada' });
    }

    if (transaction.userId !== req.user.id) {
      return res.status(403).json({ error: 'No tenés permiso para modificar esta transacción' });
    }

    if (categoryId) {
      const categoria = await Category.findByPk(categoryId);
      if (!categoria) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
    }

    await transaction.update({ monto, tipo, descripcion, fecha, categoryId });

    const resultado = await Transaction.findByPk(id, {
      include: [{ model: Category, as: 'category' }]
    });

    res.json({ message: 'Transacción actualizada exitosamente', transaction: resultado });
  } catch (error) {
    console.error('Error en actualizar:', error);
    res.status(500).json({ error: 'Error al actualizar transacción' });
  }
};

const eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transacción no encontrada' });
    }

    if (transaction.userId !== req.user.id) {
      return res.status(403).json({ error: 'No tenés permiso para eliminar esta transacción' });
    }

    await transaction.destroy();
    res.json({ message: 'Transacción eliminada exitosamente' });
  } catch (error) {
    console.error('Error en eliminar:', error);
    res.status(500).json({ error: 'Error al eliminar transacción' });
  }
};

module.exports = { validarTransaccion, crear, listar, balance, actualizar, eliminar };
