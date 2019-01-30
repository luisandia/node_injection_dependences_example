'use strict';
const Globals = require('src/utils/Globals');


module.exports = function(sequelize, DataTypes) {
  const Usuario = sequelize.define('personal', {
    id: {
      type : DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    nombres:DataTypes.STRING,
    a_paterno:DataTypes.STRING,
    a_materno: DataTypes.STRING
  }, {
    timestamps: false,
    freezeTableName:true,
    // classMethods: {
    //   async _getUsuarioId(correoElectronico) {
    //     try{
    //       var cor = `${correoElectronico}`;
    //       const id = await this.findOne({
    //         where: {
    //           'correoElectronico': correoElectronico
    //         },
    //         attributes : ['usuarioId']
    //       }).then(function(res) {
    //         return res.dataValues.usuarioId;
    //       });
    //       return id;
    //     } catch(error){
    //       if(error.name === 'SequelizeEmptyResultError') {
    //         const notFoundError = new Error('NotFoundError');
    //         notFoundError.details = `Correo: ${correoElectronico} no existe.`;
    //         throw notFoundError;
    //       }
    //       throw error;
    //     }
    //   },
    //   async _getUsuarioIdByUserCode(user, codigo) {
    //     try{
    //       const empresaId = `${user.empresaId}`;
    //       const codigo_usuario = `${codigo}`;

    //       return  await this.findAll({
    //         where: {
    //           'empresaId': empresaId,
    //           'codigoUsuario': codigo_usuario.toString(),
    //           'estadoUsuario': {notIn :['DEL']}
    //         },
    //         attributes : ['usuarioId']
    //       }).then(function(rows) {
    //         let len = rows.length;
    //         if(len === 0) return Globals.ID_NOT_FOUND;
    //         if(len === 1) return rows[0].dataValues.usuarioId;
    //         return Globals.MORE_THAN_ONE;
    //       });
    //     } catch(error){
    //       if(error.name === 'SequelizeEmptyResultError') {
    //         const notFoundError = new Error('NotFoundError');
    //         notFoundError.details = `Usuario con código: ${codigo} no existe.`;
    //         throw notFoundError;
    //       }
    //       throw error;
    //     }
    //   },
    //   async _getUsuarioIdByCorreoElectronico(correoElectronico) {
    //     try{
    //       const correo_electronico = `${correoElectronico}`;

    //       return  await this.findAll({
    //         where: {
    //           'correoElectronico': correo_electronico.toString(),
    //           'estadoUsuario': {notIn :['DEL']}
    //         },
    //         attributes : ['usuarioId']
    //       }).then(function(rows) {
    //         let len = rows.length;
    //         if(len === 0) return Globals.ID_NOT_FOUND;
    //         if(len === 1) return rows[0].dataValues.usuarioId;
    //         return Globals.MORE_THAN_ONE;
    //       });
    //     } catch(error){
    //       if(error.name === 'SequelizeEmptyResultError') {
    //         const notFoundError = new Error('NotFoundError');
    //         notFoundError.details = `Usuario con correo Electrónico: ${codigo} no existe.`;
    //         throw notFoundError;
    //       }
    //       throw error;
    //     }
    //   },
    //   async getEmpresaUsuarioId(usuarioId) {
    //     console.log("--> entrew")
    //     try{
    //       return await this.findById(usuarioId, { rejectOnEmpty: true });
    //     } catch(error){
    //       if(error.name === 'SequelizeEmptyResultError') {
    //         const notFoundError = new Error('NotFoundError');
    //         notFoundError.details = `Correo: ${correoElectronico} no existe.`;
    //         throw notFoundError;
    //       }
    //       throw error;
    //     }
    //   }
    // }
  });

  return Usuario;
};
