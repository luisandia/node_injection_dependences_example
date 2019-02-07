const Operation = require('src/app/Operation');

class GetMetaPersonal extends Operation {
  constructor({
    metasRepository
  }) {
    super();
    this.metasRepository = metasRepository;
  }

  async execute(params) {
    const {
      SUCCESS,
      NOT_FOUND,
      VALIDATION_ERROR,
      ERROR
    } = this.outputs;

    try {
      const metas = await this.metasRepository.getMetaPersonal(params.personal_id, params.meta_id);
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

GetMetaPersonal.setOutputs(['SUCCESS', 'NOT_FOUND', 'VALIDATION_ERROR', 'ERROR']);

module.exports = GetMetaPersonal;