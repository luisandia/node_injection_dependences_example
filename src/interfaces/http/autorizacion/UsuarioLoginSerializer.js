const bufferType = require('buffer-type');

const UsuarioLoginSerializer = {
  serialize({
    usuarioId,
    empresaId,
    sucursalId,
    puntoVentaId,
    codigoUsuario,
    nombreCompleto,
    password,
    correoElectronico,
    cargo,
    telefono,
    direccion,
    estadoUsuario,
    empresas,
    sucursals,
    mostrarPasos
    /*almacens,
    productServicios,
    contactos,*/
  }) {
    let logoTemp;
    if(empresas[0].logo !== null){
      let fileType = bufferType(empresas[0].logo);
      if(fileType) {
        logoTemp = 'data:'+fileType.type + ';base64,'+ Buffer.from(empresas[0].logo).toString('base64');
      }else {
        logoTemp = 'data:image/jpg' + ';base64,'+ Buffer.from(empresas[0].logo).toString('base64');
      }
    }
    const empresa = {
      razonSocial: empresas[0].razonSocial,
      numeroRUC: empresas[0].numeroRUC,
      logo: logoTemp,
      telefono: sucursals[0].telefono,
      correoElectronico: sucursals[0].correoElectronico,
      direccion: sucursals[0].direccion
    };
    const usuario = {
      nombreCompleto: nombreCompleto,
      mostrarPasos: mostrarPasos
    };
    /*items = productServicios.length;
    almacenes = almacens.length;
    contactos = contactos.length;*/

    return {
      empresa,
      usuario,
      /*items,
      almacenes,
      contactos*/
    };
  }
};

module.exports = UsuarioLoginSerializer;
