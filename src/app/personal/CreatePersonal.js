const Operation = require('src/app/Operation');

class CreateUsuario extends Operation {
  constructor({ personalRepository }) {
    super();
    this.personalRepository = personalRepository;
  }

  async execute(datosPersonal) {
    
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;

    try {      

      const newPersonal = await this.personalRepository.createPersonal(datosPersonal);

      this.emit(SUCCESS, newPersonal);
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
