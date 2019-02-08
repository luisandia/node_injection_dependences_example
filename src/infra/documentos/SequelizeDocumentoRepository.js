// const UsuarioMapper = require('./SequelizeUsuarioMapper');
// const Usuario = require('src/domain/usuario/Usuario');
// const Globals = require('src/utils/Globals');
// const CompleteUsuarioMapper = require('./SequelizeCompleteUsuarioMapper');
// const bcrypt = require('bcryptjs');

var Sequelize = require('sequelize');
const Op = Sequelize.Op;
class SequelizeDocumentoRepository {
  constructor({
    DocumentoModel,
    PersonalModel,
    database
  }) {
    this.documentoModel = DocumentoModel;
    this.personalModel = PersonalModel;
    this.database = database

  }

  async create(datos) {

    try {
      let result = this.database.transaction().then((t) => {
        let id = this.documentoModel.create(datos, {
          transaction: t
        }).then(() => {
          let fs = require('fs');
          let arrayPath = datos.path.split('/')
          let name_alias = arrayPath[arrayPath.length - 1]
          delete arrayPath[arrayPath.length - 1];
          let new_path = arrayPath.join('/') + datos.nombre
          fs.rename(datos.path, new_path, (err) => {
            if (err) {
              t.rollback()
              console.err('ERROR: ' + err);
            }
          });
          t.commit();
        }).catch((err) => {
          t.rollback();
        });
      });

      // const result = await this.documentoModel.create(datos);
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


  async update(personal_id, metas_id, newData) {

    const transaction = await this.documentoModel.sequelize.transaction();
    try {
      const updatedMeta = await this.documentoModel.update(newData, {
        where: {
          id: metas_id,
          personal_id: personal_id
        }
      }, {
        transaction
      });
      await transaction.commit();

      return updatedMeta;
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }
  async delete(personal_id, metas_id) {
    const transaction = await this.documentoModel.sequelize.transaction();
    try {
      const deleteUsuario = await this.documentoModel.destroy({
        where: {
          id: metas_id,
          personal_id: personal_id
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
      const Personal = await this.documentoModel.findAndCountAll({
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
  async getDocumentosPersonal(page, size, personal_id, value) {
    try {
      const Personal = await this.documentoModel.findAndCountAll({
        limit: size,
        offset: size * page,
        where: {
          personal_id: personal_id,
          nombre: {
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
  async getDocumentoPersonal(personal_id, metas_id) {
    try {
      const Personal = await this.documentoModel.findOne({
        where: {
          personal_id: personal_id,
          id: metas_id
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
      select pm.*,p.nombres || ' ' || p.a_paterno || ' ' || p.a_materno as nombre_empleado ,row_number() over (partition by personal_id order by nombre desc) as row_number 
      from personal_documentos pm
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

module.exports = SequelizeDocumentoRepository;