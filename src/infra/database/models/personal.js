/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('personal', {
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
    timestamps: false,
    freezeTableName:true
  }, {
    tableName: 'personal'
  });
};
