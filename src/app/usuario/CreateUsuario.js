const Operation = require('src/app/Operation');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class CreateUsuario extends Operation {
  constructor({ usuariosRepository }) {
    super();
    this.usuariosRepository = usuariosRepository;
  }

  async execute(datosUsuario) {
    
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;

    try {

      const generatedPassword = crypto.randomBytes(5).toString('hex');

      let hashedPassword = bcrypt.hashSync(generatedPassword, 8);
      console.log("--> generatedPassword=",generatedPassword);
      
      datosUsuario.password = hashedPassword;

      const newUsuario = await this.usuariosRepository.createUsuario(datosUsuario);

      this.emit(SUCCESS, newUsuario);
    } catch(error) {
      if(error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

CreateUsuario.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);

module.exports = CreateUsuario;
