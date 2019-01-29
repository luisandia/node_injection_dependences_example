const Operation = require('src/app/Operation');
// const UsuarioRegistro = require('src/domain/usuario/UsuarioRegistro');
// const bcrypt = require('bcryptjs');
// const Globals = require('src/utils/Globals');
// const crypto = require('crypto');

class CreateUsuario extends Operation {
  constructor(/*{ usuariosRepository }*/) {
    super();
    // this.usuariosRepository = usuariosRepository;
  }

  async execute(usuario, datosUsuario) {
    
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;
    this.emit(SUCCESS,{message:"mi primer mensaje desde createusuario"});
    // try {

    //   const generatedPassword = crypto.randomBytes(5).toString('hex');

    //   let hashedPassword = bcrypt.hashSync(generatedPassword, 8);
    //   console.log("--> generatedPassword=",generatedPassword);
      
    //   datosUsuario.password = hashedPassword;

    //   const newUsuario = await this.usuariosRepository.createUsuario(usuario, datosUsuario, generatedPassword);

    //   this.emit(SUCCESS, newUsuario);
    // } catch(error) {
    //   if(error.message === 'ValidationError') {
    //     return this.emit(VALIDATION_ERROR, error);
    //   }

    //   this.emit(ERROR, error);
    // }
  }
}

CreateUsuario.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);

module.exports = CreateUsuario;
