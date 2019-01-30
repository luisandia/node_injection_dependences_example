const { attributes } = require('structure');
const Regex = require('src/utils/Regex');
const Globals = require('src/utils/Globals');

const Usuario = attributes({
  usuarioId: {
  	type: Number,
  	empty: true,
  },
  codigoUsuario: {
    type: String,
    empty: true,
    maxLength: Regex.codigoTablaLength
  },
  empresaId: {
    type: Number,
    empty: true
  },
  sucursalId: {
    type: Number,
    empty: true
  },
  almacenId: {
    type: Number,
    empty: true
  },
  nombreCompleto: {
    type: String,
    required: true,
    maxLength: Regex.nombreTablaLength
  },
  correoElectronico: {
    type: String,
    required: true,
    maxLength: Regex.correoElectronicoLength
  },
  password: {
    type: String,
    required: true
  },
  cargo: {
    type: String,
    empty: true,
    maxLength: Regex.nombreTablaLength
  },
  telefono: {
    type: String,
    empty: true,
    maxLength: Regex.telefonoCelularLength
  },
  direccion: {
    type: String,
    empty: true,
    maxLength: Regex.direccionLength
  },
  rolId: {
    type: Number,
    empty: true
  },
  generatedPassword: {
    type: String,
    required: false
  },
  estadoUsuario: {
    type: String,
    empty: true,
    default: '',
    equal: [Globals.DELETE, Globals.ACTIVAR, Globals.DESACTIVAR]
  },
  mostrarPasos: {
    type: String,
    empty: true,
    default: Globals.SI,
    equal: [Globals.SI, Globals.NO]
  }
})(class Usuario {

  /*
  * Setters
  */
  setUsuarioId(usuarioId){
    this.usuarioId = usuarioId;
  }
  setCodigoUsuario(codigoUsuario){
    this.codigoUsuario = codigoUsuario;
  }
  setEmpresaId(empresaId){
    this.empresaId = empresaId;
  }
  setNombreCompleto(nombreCompleto){
    this.nombreCompleto = nombreCompleto;
  }
  setCorreoElectronico(correoElectronico){
    this.correoElectronico = correoElectronico;
  }
  setHashPassword(pass) { //setPassword
    this.password = pass;
  }
  setGeneratedPassword(pass) {
    this.generatedPassword = pass;
  }
  setCargo(cargo){
    this.cargo = cargo;
  }
  setTelefono(telefono){
    this.telefono = telefono;
  }
  setDireccion(direccion){
    this.direccion = direccion;
  }
  setRolId(rolId){
    this.rolId = rolId;
  }
  setEstado(value) { // setEstadoUsuario
    this.estadoUsuario = value;
  }
  setMostrarPasos(value) {
    this.mostrarPasos = value;
  }
  /*
  * Getters
  */
  getUsuarioId(){
    return this.usuarioId;
  }
  getCodigoUsuario(){
    return this.codigoUsuario;
  }
  getEmpresaId(){
    return this.empresaId;
  }
  getNombreCompleto() {
    return this.nombreCompleto;
  }
  getCorreoElectronico() {
    return this.correoElectronico;
  }
  getPassword() {
    return this.password;
  }
  getGeneratedPassword() {
    return this.generatedPassword;
  }
  getCargo(){
    return this.cargo;
  }
  getTelefono(){
    return this.telefono;
  }
  getDireccion(){
    return this.direccion;
  }
  getRolId(){
    return this.rolId;
  }
  getEstadoUsuario() {
    return this.estadoUsuario;
  }
  getMostrarPasos() {
    return this.mostrarPasos;
  }
});

module.exports = Usuario;
