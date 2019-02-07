const Operation = require('src/app/Operation');

class UpdateDocumento extends Operation {
  constructor({
    documentoRepository
  }) {
    super();
    this.documentoRepository = documentoRepository;
  }

  async execute(params, meta) {
    const {
      SUCCESS,
      NOT_FOUND,
      VALIDATION_ERROR,
      ERROR
    } = this.outputs;

    try {
      const contacto = await this.documentoRepository.update(params.personal_id,params.documento_id, meta);
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

UpdateDocumento.setOutputs(['SUCCESS', 'NOT_FOUND', 'VALIDATION_ERROR', 'ERROR']);

module.exports = UpdateDocumento;