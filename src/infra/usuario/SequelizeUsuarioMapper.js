const Usuario = require('src/domain/usuario/Usuario');

const SequelizeUsuarioMapper = {
  toEntity({ dataValues }) {
    const {
    	usuarioId,
        codigoUsuario,
        empresaId,
        sucursalId,
        almacenId,
        nombreCompleto,
        correoElectronico,
        password,
        cargo,
		telefono,
		direccion,
        estadoUsuario,
        rolId,
        mostrarPasos
    } = dataValues;

    return new Usuario({
        usuarioId,
        codigoUsuario,
        empresaId,
        sucursalId,
        almacenId,
        nombreCompleto,
        correoElectronico,
        password,
        cargo,
		telefono,
		direccion,
        estadoUsuario,
        rolId,
        mostrarPasos
    });
  },

  toDatabase(dataValues) {
    const {
        usuarioId,
        codigoUsuario,
        empresaId,
        almacenId,
        sucursalId,
        puntoVentaId,
        nombreCompleto,
        correoElectronico,
        password,
        cargo,
		telefono,
		direccion,
        estadoUsuario,
        rolId,
        mostrarPasos
    } = dataValues;

    return {
        usuarioId,
        codigoUsuario,
        empresaId,
        almacenId,
        sucursalId,
        puntoVentaId,
        nombreCompleto,
        correoElectronico,
        password,
        cargo,
		telefono,
		direccion,
        estadoUsuario,
        rolId,
        mostrarPasos
    };
  }
};

module.exports = SequelizeUsuarioMapper;
