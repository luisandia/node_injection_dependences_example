const Usuario = require('src/domain/usuario/Usuario');

/*
* SequelizeFacturaMapper,
*/
const SequelizeCompleteUsuarioMapper = {
  toEntity({ dataValues }) {
    const {
      usuarioId,
      codigoUsuario,
      empresaId,
      sucursalId,
      puntoVentaId,
      almacenId,
      nombreCompleto,
      correoElectronico,
      password,
      cargo,
      telefono,
      direccion,
      rolId,
      estadoUsuario,
      mostrarPasos
    } = dataValues;

    return new Usuario({
      usuarioId,
      codigoUsuario,
      nombreCompleto,
      correoElectronico,
      password,
      cargo,
      telefono,
      direccion,
      estadoUsuario,
      mostrarPasos
    });
  },

  toDatabase(dataValues) {
    const {
      usuarioId,
      codigoUsuario,
      empresaId,
      sucursalId,
      puntoVentaId,
      almacenId,
      nombreCompleto,
      correoElectronico,
      password,
      cargo,
      telefono,
      direccion,
      rolId,
      estadoUsuario
    } = dataValues;

    return {
      usuarioId,
      codigoUsuario,
      empresaId,
      sucursalId,
      puntoVentaId,
      almacenId,
      nombreCompleto,
      correoElectronico,
      password,
      cargo,
      telefono,
      direccion,
      rolId,
      estadoUsuario
    };
  }
};

module.exports = SequelizeCompleteUsuarioMapper;
