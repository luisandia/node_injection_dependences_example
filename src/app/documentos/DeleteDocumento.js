const Operation = require('src/app/Operation');

class DeleteDocumento extends Operation {
  constructor({
    documentoRepository
  }) {
    super();
    this.documentoRepository = documentoRepository;
  }

  async execute(params) {
    const {
      SUCCESS,
      NOT_FOUND,
      VALIDATION_ERROR,
      ERROR
    } = this.outputs;

    try {
      const contacto = await this.documentoRepository.delete(params.personal_id,params.documento_id);
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

DeleteDocumento.setOutputs(['SUCCESS', 'NOT_FOUND', 'VALIDATION_ERROR', 'ERROR']);

module.exports = DeleteDocumento;