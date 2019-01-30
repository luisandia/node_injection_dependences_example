const { attributes } = require('structure');
const Regex = require('src/utils/Regex');
const Globals = require('src/utils/Globals');

/*
* Class Sucursal: entidad para mapeo
*/
const Sucursal = attributes({
  sucursalId: {
  	type : Number,
    empty: true,
  },
  codigoSucursal: { //requerido con el nombre que tiene y no puede ser '' or null
  	type: String,
    required: true,
    maxLength: Regex.codigoTablaLength
  },
  empresaId: { //requerido con el nombre que tiene y no puede ser '' or null
    type: Number,
    empty: true,
  },
  tipoSucursal: {
    type: String,
    empty: true,
    maxLength: Regex.tipoTablaLength,
    default: '',
  }, 
  correoElectronico: {
  	type: String,
    empty: true,
    default: '',
    maxLength: Regex.correoElectronicoLength
  },
  telefono: {
  	type: String,
    empty: true,
    default: '',
    exactLength: Regex.telefonoCelularLength
  },
  codigoBasePais: {
    type: String,
    required: true,
  },
  codigoBaseUbigeo: {
    type: String,
    empty: true,
    exactLength: 6,
    default: '',
  },
  direccion: {
  	type: String,
    empty: true,
    default: '',
    maxLength: Regex.direccionLength
  },
  estadoSucursal: {
    type: String,
    empty: true,
    default: '',
    equal: [Globals.DELETE, Globals.ACTIVAR, Globals.DESACTIVAR]
  }

})(class Sucursal {
  /*
  * Setters
  */ 
  setSucursalId(sucursalId){
    this.sucursalId = sucursalId;
  }
  setCodigoSucursal(codigoSucursal){
    this.codigoSucursal = codigoSucursal;
  }
  setEmpresaId(empresaId){
    this.empresaId = empresaId;
  }
  setTipoSucursal(tipoSucursal){
    this.tipoSucursal = tipoSucursal;
  }
  setCorreoElectronico(correoElectronico){
    this.correoElectronico = correoElectronico;
  }
  setTelefono(telefono){
    this.telefono = telefono;
  }
  setCodigoBasePais(codigoBasePais){
    this.codigoBasePais = codigoBasePais;
  }
  setCodigoBaseUbigeo(codigoBaseUbigeo) {
    this.codigoBaseUbigeo = codigoBaseUbigeo;
  }
  setDireccion(direccion) {
    this.direccion = direccion;
  }
  setEstadoSucursal(estado) {
    this.estadoSucursal = estado;
  }
  /*
  * Getters
  */
  getSucursalId(){
    return this.sucursalId;
  }
  getCodigoSucursal(){
    return this.codigoSucursal;
  }
  getEmpresaId(){
    return this.empresaId;
  }
  getTipoSucursal(){
    return this.tipoSucursal;
  }
  getCorreoElectronico(){
    return this.correoElectronico;
  }
  getTelefono(){
    return this.telefono;
  }
  getCodigoBasePais(){
    return this.codigoBasePais;
  }
  getCodigoBaseUbigeo() {
    return this.codigoBaseUbigeo;
  }
  getDireccion() {
    return this.direccion;
  }
  getEstadoSucursal() {
    return this.estadoSucursal;
  }
});

module.exports = Sucursal;
