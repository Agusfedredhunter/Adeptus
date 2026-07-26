const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50]
      }
    },
    tipo: {
      type: DataTypes.ENUM('ingreso', 'gasto'),
      allowNull: false
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: '#3B82F6'
    }
  }, {
    tableName: 'categories',
    timestamps: true
  });

  return Category;
};
