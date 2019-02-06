const Operation = require('src/app/Operation');

class GetMetasPersonal extends Operation {
  constructor({
    metasRepository
  }) {
    super();
    this.metasRepository = metasRepository;
  }

  async execute(query) {
    const {
      SUCCESS,
      NOT_FOUND,
      VALIDATION_ERROR,
      ERROR
    } = this.outputs;

    try {
      const metas = await this.metasRepository.getMetasPersonal(query.page, query.size, query.personal_id, query.value);
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

GetMetasPersonal.setOutputs(['SUCCESS', 'NOT_FOUND', 'VALIDATION_ERROR', 'ERROR']);

module.exports = GetMetasPersonal;