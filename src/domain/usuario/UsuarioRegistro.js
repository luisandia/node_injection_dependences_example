const { attributes } = require('structure');
const Regex = require('src/utils/Regex');
const Globals = require('src/utils/Globals');

const UsuarioRegistro = attributes({
  correoElectronico: {
  	type: String,
    required: true,
    maxLength: Regex.correoElectronicoLength
  },
  password: {
    type: String,
    required: true,
  },
  razonSocial: {
    type: String,
    required: true,
    maxLength: Regex.razonSocialNombreLength
  },
  nombreCompleto: {
    type: String,
    required: true
  }
})(class UsuarioRegistro {

  /*
  * Setters
  */
  setPassword(pass) {
    this.password = pass;
  }
  setRazonSocial(razonSocial) {
    this.razonSocial = razonSocial;
  }
  setCorreoElectronico(correoElectronico) {
    this.correoElectronico = correoElectronico;
  }
  setNombreCompleto(nombreCompleto){
    this.nombreCompleto = nombreCompleto;
  }

  /*
  * Getters
  */
  getPassword() {
    return this.password;
  }
  getRazonSocial() {
    return this.razonSocial;
  }
  getCorreoElectronico() {
    return this.correoElectronico;
  }
  getNombreCompleto(){
    return this.nombreCompleto;
  }
});

module.exports = UsuarioRegistro;
