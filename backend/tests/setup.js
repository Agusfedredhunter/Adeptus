const { sequelize, Category } = require('../models');

async function resetDb() {
  await sequelize.sync({ force: true });
  await Category.bulkCreate([
    { nombre: 'Sueldo', tipo: 'ingreso', color: '#22C55E' },
    { nombre: 'Comida', tipo: 'gasto', color: '#EF4444' },
  ]);
}

module.exports = { resetDb };
