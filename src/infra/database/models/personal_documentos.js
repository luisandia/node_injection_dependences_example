/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const personal_documentos= sequelize.define('personal_documentos', {
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

  personal_documentos.belongsTo(sequelize.models.personal, {
    foreignKey: 'personal_id',
    targetKey: 'id'
  });
  sequelize.models.personal.hasMany(sequelize.models.personal_documentos, {
    foreignKey: 'personal_id',
    sourceKey: 'id'
  });
  return personal_documentos
};
