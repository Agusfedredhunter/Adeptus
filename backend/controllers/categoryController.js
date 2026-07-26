const { Category } = require('../models');

const listar = async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['tipo', 'ASC'], ['nombre', 'ASC']] });
    res.json({ categories });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

const crear = async (req, res) => {
  try {
    const { nombre, tipo, color } = req.body;

    if (!nombre || !tipo) {
      return res.status(400).json({ error: 'Nombre y tipo son requeridos' });
    }

    const category = await Category.create({ nombre, tipo, color });
    res.status(201).json({ message: 'Categoría creada exitosamente', category });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map((e) => e.message).join(', ') });
    }
    console.error('Error al crear categoría:', error);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
};

const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, tipo, color } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    await category.update({ nombre, tipo, color });
    res.json({ message: 'Categoría actualizada exitosamente', category });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map((e) => e.message).join(', ') });
    }
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
};

const eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    await category.destroy();
    res.json({ message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
};

module.exports = { listar, crear, actualizar, eliminar };
