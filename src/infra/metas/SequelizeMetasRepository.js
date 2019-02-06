// const UsuarioMapper = require('./SequelizeUsuarioMapper');
// const Usuario = require('src/domain/usuario/Usuario');
// const Globals = require('src/utils/Globals');
// const CompleteUsuarioMapper = require('./SequelizeCompleteUsuarioMapper');
// const bcrypt = require('bcryptjs');

class SequelizeMetasRepository {
  constructor({
    MetasModel
  }) {
    this.metasModel = MetasModel;
  }

  async create(datos) {
    try {
      const metas = await this.metasModel.create(datos);
      //   const usuario = await this.metasModel.findById(newUsuarioId)
      return metas;
    } catch (error) {
      if (error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = ` ocurrio un error`;
        throw notFoundError;
      }
      throw error;
    }
  }


  async update(metas_id, newData) {
    const transaction = await this.metasModel.sequelize.transaction();
    try {
      const updatedUsuario = await this.metasModel.update(newData, {
        where: {
          id: metas_id
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
  async delete(metas_id) {
    const transaction = await this.metasModel.sequelize.transaction();
    try {
      const deleteUsuario = await this.metasModel.destroy({
        where: {
          id: metas_id
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
  async get(page,size) {
    try {
      const Personal = await this.metasModel.findAndCountAll({
        limit: size,
        offset: size*page,
      });
      return Personal;
    } catch (error) {
      throw error;
    }
  }


}

module.exports = SequelizeMetasRepository;