const UsuarioSerializer = {
  serialize({
  	usuarioId,
		empresaId,
		codigoUsuario,
  	nombreCompleto,
  	correoElectronico,
		password,
		cargo,
		telefono,
		direccion,
  }) {
    return {
		codigoUsuario,
  	nombreCompleto,
  	correoElectronico,
		cargo
    };
  }
};

module.exports = UsuarioSerializer;
