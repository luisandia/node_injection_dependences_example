// const UsuarioMapper = require('./SequelizeUsuarioMapper');
// const Usuario = require('src/domain/usuario/Usuario');
// const Globals = require('src/utils/Globals');
// const CompleteUsuarioMapper = require('./SequelizeCompleteUsuarioMapper');
// const bcrypt = require('bcryptjs');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
class SequelizePersonalRepository {
  constructor({PersonalModel}) {
    this.personalModel = PersonalModel;
  }

  async createPersonal(datos) {
    try {
      const personal = await this.personalModel.create(datos);
      //   const usuario = await this.personalModel.findById(newUsuarioId)
      return personal;
    } catch (error) {
      if (error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = ` ocurrio un error`;
        throw notFoundError;
      }
      throw error;
    }
  }
  //   async getAllUsuarios(page, size) {
  //     try {
  //       const usuariosPage = await this.PersonalModel.findAndCountAll({
  //         limit: size,
  //         offset: size * page
  //       });
  //       return usuariosPage;
  //     } catch (error) {
  //       if (error.name === 'SequelizeEmptyResultError') {
  //         const notFoundError = new Error('NotFoundError');
  //         notFoundError.details = ` limit is exceded`;
  //         throw notFoundError;
  //       }
  //       throw error;
  //     }
  //   }

  //   async getAllUsuariosByPageSizeAndBodyJSON(page, size, body, user) {
  //     try {
  //       var nombre = body.valor;
  //       const usuariosPage = await this.PersonalModel.findAndCountAll({
  //         attributes: ['codigoUsuario',
  //           'nombreCompleto',
  //           'correoElectronico',
  //           'estadoUsuario'
  //         ],
  //         include: [{
  //           model: this.RolModel,
  //           attributes: ['nombreRol', 'codigoRol']
  //         }],
  //         limit: size,
  //         offset: size * page,
  //         where: {
  //           'empresaId': user.empresaId,
  //           'estadoUsuario': {
  //             notIn: ['DEL']
  //           },
  //           'codigoUsuario': {
  //             notIn: ['ADMIN_PUR']
  //           },
  //           'nombreCompleto': {
  //             ilike: '%' + nombre + '%'
  //           },
  //         }
  //       });
  //       return usuariosPage;
  //     } catch (error) {
  //       if (error.name === 'SequelizeEmptyResultError') {
  //         const notFoundError = new Error('NotFoundError');
  //         notFoundError.details = ` limit is exceded`;

  //         throw notFoundError;
  //       }
  //       throw error;
  //     }
  //   }

  //   async _getUsuarioId(usuario) {
  //     try {
  //       return await this.PersonalModel.findOne({
  //         where: {
  //           'correoElectronico': usuario
  //         },
  //         attributes: ['usuarioId']
  //       });
  //     } catch (error) {
  //       if (error.name === 'SequelizeEmptyResultError') {
  //         const notFoundError = new Error('NotFoundError');
  //         notFoundError.details = `Usuario no existe.`;
  //         throw notFoundError;
  //       }
  //       throw error;
  //     }
  //   }

  //   async deleteUsuario(user, datosUsuario) {

  //     const usuarioId = await
  //     this.PersonalModel._getUsuarioIdByUserCode(user,
  //     datosUsuario.codigoUsuario); const usuario = await
  //     this._getById(usuarioId);

  //     const transaction = await this.PersonalModel.sequelize.transaction();

  //     try {
  //       //borrado logico
  //       const deletedUsuario = await usuario.update({
  //         'estadoUsuario': Globals.DELETE
  //       }, {
  //         transaction
  //       });
  //       await transaction.commit();
  //       return "El Usuario se eliminó Satisfactoriamente";
  //     } catch (error) {
  //       await transaction.rollback();
  //       throw error;
  //     }

  //   }

  async updatePersonal(personal_id, newData) {
    const transaction = await this.personalModel.sequelize.transaction();
    try {
      const updatedUsuario = await this.personalModel.update(
          newData, {where: {id: personal_id}}, {transaction});
      await transaction.commit();

      return updatedUsuario;
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }
  async deletePersonal(personal_id) {
    const transaction = await this.personalModel.sequelize.transaction();
    try {
      const deleteUsuario = await this.personalModel.destroy(
          {where: {id: personal_id}}, {transaction});
      await transaction.commit();
      return deleteUsuario;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  async getPersonal(page, size, value) {
    try {
      const Personal = await this.personalModel.findAndCountAll({
        limit: size,
        offset: size * page,
        where: {
          nombres: {
            [Op.iLike]: `%${value}%`
          }
        },
      });
      return Personal;
    } catch (error) {
      throw error;
    }
  }
  async get(personal_id) {
    try {
      const Personal =
          await this.personalModel.findOne({where: {id: personal_id}});
      return Personal;
    } catch (error) {
      throw error;
    }
  }


  //     if (usuarioIdCorreo != Globals.MORE_THAN_ONE) {
  //       const error = new Error('ValidationError');
  //       error.details = {
  //         "type": 'error_correoElectronico_repeat',
  //         "status": 'error',
  //         "message": `El correo electrónico de usuario ya existe`
  //       }
  //       throw error;
  //     }

  //   }

  //   async count() {
  //     return await this.PersonalModel.count();
  //   }

  //   async _getById(usuarioId) {

  //     try {
  //       return await this.PersonalModel.findById(usuarioId, {
  //         rejectOnEmpty: true
  //       });
  //     } catch (error) {
  //       if (error.name === 'SequelizeEmptyResultError') {
  //         const notFoundError = new Error('NotFoundError');
  //         notFoundError.details = `Usuario with usuarioId ${usuarioId} can't
  //         be found.`;

  //         throw notFoundError;
  //       }

  //       throw error;
  //     }
  //   }


  //   async getUsuarioPerfil(usuario) {
  //     try {
  //       return await this.PersonalModel.findById(usuario.usuarioId);

  //     } catch (error) {
  //       if (error.name === 'SequelizeEmptyResultError') {
  //         const notFoundError = new Error('NotFoundError888');
  //         notFoundError.details = `Usuario con numero ${usuario.usuarioId} no
  //         existe.`;

  //         throw notFoundError;
  //       }

  //       throw error;
  //     }
  //   }
}

module.exports = SequelizePersonalRepository;