/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('personal_metas', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    personal_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'personal',
        key: 'id'
      }
    },
    meta: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fecha_prevista: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'personal_metas'
  });
};
