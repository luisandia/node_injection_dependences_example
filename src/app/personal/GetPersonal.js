const Operation = require('src/app/Operation');

class GetPersonal extends Operation {
  constructor({
    personalRepository
  }) {
    super();
    this.personalRepository = personalRepository;
  }

  async execute(page, size) {
    const {
      SUCCESS,
      NOT_FOUND,
      VALIDATION_ERROR,
      ERROR
    } = this.outputs;

    try {
      const personal = await this.personalRepository.getPersonal(page, size);
      this.emit(SUCCESS, personal);
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

GetPersonal.setOutputs(['SUCCESS', 'NOT_FOUND', 'VALIDATION_ERROR', 'ERROR']);

module.exports = GetPersonal;