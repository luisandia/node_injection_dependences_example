// const UsuarioMapper = require('./SequelizeUsuarioMapper');
// const Usuario = require('src/domain/usuario/Usuario');
// const Globals = require('src/utils/Globals');
// const CompleteUsuarioMapper = require('./SequelizeCompleteUsuarioMapper');
// const bcrypt = require('bcryptjs');

class SequelizeDocumentoRepository {
  constructor({
    DocumentoModel
  }) {
    this.documentoModel = DocumentoModel;
  }

  async create(datos) {
    try {
      const result = await this.documentoModel.create(datos);
      //   const usuario = await this.documentoModel.findById(newUsuarioId)
      return result;
    } catch (error) {
      if (error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = ` ocurrio un error`;
        throw notFoundError;
      }
      throw error;
    }
  }
  async update(personal_id, newData) {
    const transaction = await this.documentoModel.sequelize.transaction();
    try {
      const updatedUsuario = await this.documentoModel.update(newData, {
        where: {
          id: personal_id
        }
      }, {
        transaction
      });
      await transaction.commit();

      return updatedUsuario;
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }
  async delete(personal_id) {
    const transaction = await this.documentoModel.sequelize.transaction();
    try {
      const deleteUsuario = await this.documentoModel.destroy({
        where: {
          id: personal_id
        }
      }, {
        transaction
      });
      await transaction.commit();
      return deleteUsuario;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  async getAll(page, size) {
    try {
      const Personal = await this.documentoModel.findAndCountAll({
        limit: size,
        offset: size * page,
      });
      return Personal;
    } catch (error) {
      throw error;
    }
  }
  async get(personal_id) {
    try {
      const Personal = await this.documentoModel.findOne({
        where: {
          id: personal_id
        }
      });
      return Personal;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SequelizeDocumentoRepository;