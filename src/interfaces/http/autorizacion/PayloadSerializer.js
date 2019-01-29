const UsuarioLoginSerializer = {
  serialize({
    usuarioId,
    empresaId,
    sucursalId,
    puntoVentaId,
    almacenId,
    correoElectronico
  }) {
    return {
      usuarioId,
      empresaId,
      sucursalId,
      puntoVentaId,
      almacenId,
      correoElectronico
    };
  }
};

module.exports = UsuarioLoginSerializer;
