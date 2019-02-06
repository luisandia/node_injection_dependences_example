const Operation = require('src/app/Operation');

class GetPersonal extends Operation {
  constructor({
    metasRepository
  }) {
    super();
    this.metasRepository = metasRepository;
  }

  async execute(page,size) {
    const {
      SUCCESS,
      NOT_FOUND,
      VALIDATION_ERROR,
      ERROR
    } = this.outputs;

    try {
      const metas = await this.metasRepository.get(page,size);
      this.emit(SUCCESS, metas);
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