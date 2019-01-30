'use strict';
const Globals = require('src/utils/Globals');


module.exports = function(sequelize, DataTypes) {
  const Usuario = sequelize.define('personal', {
    id: {
      type : DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    nombres:DataTypes.STRING,
    a_paterno:DataTypes.STRING,
    a_materno: DataTypes.STRING
  }, {
    timestamps: false,
    freezeTableName:true
  });

  return Usuario;
};
