/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('personal_documentos', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    personal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'personal',
        key: 'id'
      }
    },
    nombre: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    tableName: 'personal_documentos'
  });
};
