/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const personal = sequelize.define('personal', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nombres: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    a_paterno: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    a_materno: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'personal',
    timestamps: false,
    freezeTableName: true
  });
  // personal.hasMany(sequelize.models.personal_metas, {
  //   foreignKey: 'personal_id',
  //   sourceKey: 'id'
  // });
 

  return personal;
};