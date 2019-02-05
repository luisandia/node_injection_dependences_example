/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('login', {
    login_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'login'
  });
};
