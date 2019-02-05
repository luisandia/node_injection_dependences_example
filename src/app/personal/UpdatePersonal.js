const Operation = require('src/app/Operation');

class UpdatePersonal extends Operation {
  constructor({
    personalRepository
  }) {
    super();
    this.personalRepository = personalRepository;
  }

  async execute(params,usuario) {
    const {
      SUCCESS,
      NOT_FOUND,
      VALIDATION_ERROR,
      ERROR
    } = this.outputs;

    try {
      const contacto = await this.personalRepository.updatePersonal(params.personal_id,usuario);
      this.emit(SUCCESS, contacto);
    } catch (error) {
      switch (error.message) {
        case 'ValidationError':
          return this.emit(VALIDATION_ERROR, error);
        case 'NotFoundError':
          return this.emit(NOT_FOUND, error);
        default:
          this.emit(ERROR, error);
      }
    }
  }
}

UpdatePersonal.setOutputs(['SUCCESS', 'NOT_FOUND', 'VALIDATION_ERROR', 'ERROR']);

module.exports = UpdatePersonal;