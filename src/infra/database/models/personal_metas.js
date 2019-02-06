/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const personal_metas = sequelize.define('personal_metas', {
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
    timestamps: false,
    freezeTableName: true
  }, 
  {
    tableName: 'personal_metas',
    timestamps: false,
    freezeTableName: true 
  });
  personal_metas.belongsTo(sequelize.models.personal, {
    foreignKey: 'personal_id',
    targetKey: 'id'
  });
  sequelize.models.personal.hasMany(sequelize.models.personal_metas, {
    foreignKey: 'personal_id',
    sourceKey: 'id'
  });
  return personal_metas;
};