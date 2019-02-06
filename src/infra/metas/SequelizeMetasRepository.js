// const UsuarioMapper = require('./SequelizeUsuarioMapper');
// const Usuario = require('src/domain/usuario/Usuario');
// const Globals = require('src/utils/Globals');
// const CompleteUsuarioMapper = require('./SequelizeCompleteUsuarioMapper');
// const bcrypt = require('bcryptjs');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
class SequelizeMetasRepository {
  constructor({
    MetasModel,
    PersonalModel,
    database
  }) {
    this.metasModel = MetasModel;
    this.personalModel = PersonalModel;
    this.database = database

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
  async get(page, size, value) {
    try {
      const Personal = await this.metasModel.findAndCountAll({
        limit: size,
        offset: size * page,
        where: {
          meta: {
            [Op.iLike]: `%${value}%`
          }
        },
        include: [{
          model: this.personalModel,
          required: false,
        }]
      });
      return Personal;
    } catch (error) {
      throw error;
    }
  }

  async getRawQuery(page, size, value) {
    try {
      const Personal = await this.database.query(`
      select * from (
      select pm.*,p.nombres || ' ' || p.a_paterno || ' ' || p.a_materno as nombre ,row_number() over (partition by personal_id order by fecha_prevista desc) as row_number 
      from personal_metas pm
      inner join personal p
      on p.id = pm.personal_id 
      where p.nombres ilike '%${value}%' ) as T
      where row_number=1
      limit ${size} offset ${size*page}
      `, {
        type: Sequelize.QueryTypes.SELECT
      }).then(res => {
        console.log(res);
        return res;
      });
      return Personal;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SequelizeMetasRepository;