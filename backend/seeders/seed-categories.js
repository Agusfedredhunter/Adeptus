'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('categories', [
      { nombre: 'Sueldo',        tipo: 'ingreso', color: '#22C55E', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Freelance',     tipo: 'ingreso', color: '#3B82F6', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Otros ingresos',tipo: 'ingreso', color: '#A855F7', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Comida',        tipo: 'gasto',   color: '#EF4444', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Transporte',    tipo: 'gasto',   color: '#F97316', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Servicios',     tipo: 'gasto',   color: '#EAB308', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Salud',         tipo: 'gasto',   color: '#06B6D4', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Entretenimiento',tipo: 'gasto',  color: '#EC4899', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Otros gastos',  tipo: 'gasto',   color: '#6B7280', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
