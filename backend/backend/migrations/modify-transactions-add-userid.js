'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('transactions', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: true, // se completa como NOT NULL luego de poblar filas existentes
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('transactions', 'userId');
  }
};
