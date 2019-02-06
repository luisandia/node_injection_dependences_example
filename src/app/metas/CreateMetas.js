const Operation = require('src/app/Operation');

class CreateMetas extends Operation {
  constructor({
    metasRepository
  }) {
    super();
    this.metasRepository = metasRepository;
  }

  async execute(datosMetas) {
    const {
      SUCCESS,
      ERROR,
      VALIDATION_ERROR
    } = this.outputs;

    try {

      const newPersonal = await this.metasRepository.create(datosMetas);

      this.emit(SUCCESS, newPersonal);
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

CreateMetas.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);

module.exports = CreateMetas;