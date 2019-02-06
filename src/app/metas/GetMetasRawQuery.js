const Operation = require('src/app/Operation');

class GetMetasRawQuery extends Operation {
  constructor({
    metasRepository
  }) {
    super();
    this.metasRepository = metasRepository;
  }

  async execute(page, size,value) {
    const {
      SUCCESS,
      NOT_FOUND,
      VALIDATION_ERROR,
      ERROR
    } = this.outputs;

    try {
      const metas = await this.metasRepository.getRawQuery(page, size,value);
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

GetMetasRawQuery.setOutputs(['SUCCESS', 'NOT_FOUND', 'VALIDATION_ERROR', 'ERROR']);

module.exports = GetMetasRawQuery;