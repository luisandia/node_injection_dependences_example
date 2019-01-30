const UsuarioMapper = require('./SequelizeUsuarioMapper');
const Usuario = require('src/domain/usuario/Usuario');
const Globals = require('src/utils/Globals');
const CompleteUsuarioMapper = require('./SequelizeCompleteUsuarioMapper');
const bcrypt = require('bcryptjs');

class SequelizeUsuariosRepository {
  constructor({
    UsuarioModel
  }) {
    this.UsuarioModel = UsuarioModel;
  }

  async createUsuario(usuario, datos, generatedPass) {

    try {
      const usuarioCorreo = await this.UsuarioModel._getUsuarioIdByCorreoElectronico(datos.correoElectronico);

      if (usuarioCorreo === Globals.ID_NOT_FOUND) {
        const usuarioId = await this.UsuarioModel._getUsuarioIdByUserCode(usuario, datos.codigoUsuario);

        if (usuarioId === Globals.ID_NOT_FOUND) {
          try {
            datos.empresaId = usuario.empresaId;
            datos.sucursalId = usuario.sucursalId;
            datos.puntoVentaId = usuario.puntoVentaId;
            datos.almacenId = usuario.almacenId;

            const newRolId = await this.RolModel.findOne({
              where: {
                'codigoRol': datos.codigoRol,
                'empresaId': datos.empresaId,
              }
            }).then((res) => (res.dataValues.rolId));
            datos.rolId = newRolId;
            datos.generatedPassword = generatedPass;
            datos['mostrarPasos'] = Globals.SI;
            const newUsuarioId = await this.UsuarioModel.create(datos).then((res) => (res.dataValues.usuarioId));

            await this.RolUsuarioModel.create({
              'rolId': newRolId,
              'usuarioId': newUsuarioId,
              'estadoRolUsuario': 'ACT',
              'empresaId': usuario.empresaId
            });

            await this.EmailQueueModel.create({
              'id_email_template': Globals.ID_WELCOME_NEW_USER,
              'i_status': Globals.I_STATUS_INITIAL,
              's_document_id': newUsuarioId,
              's_document_class': Globals.S_DOCUMENT_CLASS_USUARIO
            });


            //CONFIGURACION INICIAL PARA PLANTILLAS
            const tipo_templates = await this.datosBaseRepository.getAllTiposPlantilla();
            for (let i = 0; i < tipo_templates.length; i++) {
              let template = tipo_templates[i].dataValues;
              await this.ConfiguracionPlantillaModel.create(
                {
                  'typeTemplate': template.codigoBase,
                  'styleTemplate': '001',
                  'usuarioId': newUsuarioId,
                  'empresaId': usuario.empresaId,
                  'fontName': 'Arial',
                  'sizeFont': '10',
                  'lineSpace': 1,
                  'bold': false,
                  'showTotalItems': false,
                  'showDescuento': false,
                  'showIGV': true,
                  'showPercentage': false
                }).then((res) => res.dataValues.configuracionId);
            }

            await this.ConfiguracionGeneralPlantillaModel.create(
              {
                'usuarioId': newUsuarioId,
                'empresaId': usuario.empresaId,
                'showTotalInString': true,
                'showLineBreak': false,
                'showDetractions': false
              }).then((res) => res.dataValues.configuracionGeneralId);

            return await this.getUsuarioByCodigoUsuario(usuario, datos.codigoUsuario);

          } catch (error) {
            if (error.name === 'SequelizeEmptyResultError') {
              const notFoundError = new Error('NotFoundError');
              notFoundError.details = ` ocurrio un error`;
              throw notFoundError;
            }
            throw error;
          }
        }
        if (usuarioId != Globals.MORE_THAN_ONE) {
          const error = new Error('ValidationError');
          error.details = {
            "type": 'error_codigoUsuario_repeat',
            "status": 'error',
            "message": `El código de usuario ya existe`
          }
          throw error;
        }
      }
      if (usuarioCorreo != Globals.MORE_THAN_ONE) {
        const error = new Error('ValidationError');
        error.details = {
          "type": 'error_correoElectronico_repeat',
          "status": 'error',
          "message": `El correo electrónico de usuario ya existe`
        }
        throw error;
      }
    } catch (error) {
      if (error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = `Usuario con numero ${usuario.usuarioId} no existe.`;
        throw notFoundError;
      }
      throw error;
    }

  }

  async getAllUsuarios(page, size) {
    try {
      const usuariosPage = await this.UsuarioModel.findAndCountAll({
        limit: size,
        offset: size * page
      });
      return usuariosPage;
    } catch (error) {
      if (error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = ` limit is exceded`;
        throw notFoundError;
      }
      throw error;
    }
  }

  async getAllUsuariosByPageSizeAndBodyJSON(page, size, body, user) {
    try {
      var nombre = body.valor;
      const usuariosPage = await this.UsuarioModel.findAndCountAll({
        attributes: ['codigoUsuario',
          'nombreCompleto',
          'correoElectronico',
          'estadoUsuario'],
        include: [{
          model: this.RolModel,
          attributes: ['nombreRol', 'codigoRol']
        }],
        limit: size,
        offset: size * page,
        where: {
          'empresaId': user.empresaId,
          'estadoUsuario': { notIn: ['DEL'] },
          'codigoUsuario': { notIn: ['ADMIN_PUR'] },
          'nombreCompleto': {
            ilike: '%' + nombre + '%'
          },
        }
      });
      return usuariosPage;
    } catch (error) {
      if (error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = ` limit is exceded`;

        throw notFoundError;
      }
      throw error;
    }
  }

  async _getUsuarioId(usuario) {
    try {
      return await this.UsuarioModel.findOne({
        where: {
          'correoElectronico': usuario
        },
        attributes: ['usuarioId']
      });
    } catch (error) {
      if (error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = `Usuario no existe.`;
        throw notFoundError;
      }
      throw error;
    }
  }

  /*   async getUsuarioByCodigoUsuario(usuario, codigo) {

      const usuarioId = await this.UsuarioModel._getUsuarioIdByUserCode(usuario, codigo);
      console.log("--> usuarioId = ", usuarioId)
      const usuario = await this.UsuarioModel.findById(usuarioId, { rejectOnEmpty: true });

      return UsuarioMapper.toEntity(usuario);

    } */

  async getUsuarioByCodigoUsuario(user, codigo) {
    const userId = await this.UsuarioModel._getUsuarioIdByUserCode(user, codigo);
    //const usuario = await this._getById(userId);

    const usuario = await this.UsuarioModel.findById(userId,
      {
        rejectOnEmpty: true,
        include: [{
          model: this.RolModel,
          attributes: ['rolId', 'codigoRol', 'nombreRol'],
        }]
      });
    return usuario;
  }

  async deleteUsuario(user, datosUsuario) {

    const usuarioId = await this.UsuarioModel._getUsuarioIdByUserCode(user, datosUsuario.codigoUsuario);
    const usuario = await this._getById(usuarioId);

    const transaction = await this.UsuarioModel.sequelize.transaction();

    try {
      //borrado logico
      const deletedUsuario = await usuario.update(
        { 'estadoUsuario': Globals.DELETE },
        { transaction });
      await transaction.commit();
      return "El Usuario se eliminó Satisfactoriamente";
    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  }

  async updateUsuario(codigoUsuario, user, newData) {

    const usuarioIdCorreo = await this.UsuarioModel._getUsuarioIdByCorreoElectronico(newData.correoElectronico);

    const usuarioId = await this.UsuarioModel._getUsuarioIdByUserCode(user, codigoUsuario.codigoUsuario);

    if (usuarioIdCorreo == usuarioId || usuarioIdCorreo === Globals.ID_NOT_FOUND) {
      if (usuarioId === Globals.ID_NOT_FOUND) {
        const error = new Error('NotFoundError');
        error.details = `El Usuario no existe`;
        throw error;
      }

      if (usuarioId === Globals.MORE_THAN_ONE) {
        const error = new Error('NotFoundError');
        error.details = `Existe mas de un usuario`;
        throw error;
      }

      const usuario = await this._getById(usuarioId);
      const transaction = await this.UsuarioModel.sequelize.transaction();

      try {

        const rolId = await this.rolRepository._getRolIdByCode(user, newData.codigoRol);
        newData.rolId = rolId;
        const updatedUsuario = await usuario.update(newData, { transaction });
        const usuarioEntity = UsuarioMapper.toEntity(updatedUsuario);

        await transaction.commit();

        return await this.getUsuarioByCodigoUsuario(user, codigoUsuario.codigoUsuario);
      } catch (error) {
        await transaction.rollback();

        throw error;
      }
    }

    if (usuarioIdCorreo != Globals.MORE_THAN_ONE) {
      const error = new Error('ValidationError');
      error.details = {
        "type": 'error_correoElectronico_repeat',
        "status": 'error',
        "message": `El correo electrónico de usuario ya existe`
      }
      throw error;
    }

  }

  async count() {
    return await this.UsuarioModel.count();
  }

  async _getById(usuarioId) {

    try {
      return await this.UsuarioModel.findById(usuarioId, { rejectOnEmpty: true });
    } catch (error) {
      if (error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = `Usuario with usuarioId ${usuarioId} can't be found.`;

        throw notFoundError;
      }

      throw error;
    }
  }

  async _getUsuarioForLogin(usuarioId) {
    try {
      return await this.UsuarioModel.findById(usuarioId,
        {
          rejectOnEmpty: true,
          include: [{
            model: this.EmpresaModel,
            attributes: ['razonSocial',
              'numeroRUC', 'logo'],
          }, {
            model: this.SucursalModel,
            required: false,
            attributes: ['telefono',
              'correoElectronico',
              'direccion'],
            where: {
              'estadoSucursal': { notIn: ['DEL'] }
            }
          }/*,
          {
            model: this.AlmacenModel,
            attributes: ['almacenId'],
            required: false,
            where: {
              'estadoAlmacen':{notIn :['DEL']}
            }
          },{
            model: this.ProductoServicioModel,
            attributes: ['productoServicioId'],
            required: false,
            where: {
              'estadoProductoServicio':{notIn :['DEL']}
            }
          },{
            model: this.ContactoModel,
            attributes: ['contactoId'],
            required: false,
            where : {
              'estadoContacto':{notIn :['DEL']}
            }
          }*/]
        });

    } catch (error) {
      if (error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = `Empresa no existe.`;

        throw notFoundError;
      }

      throw error;
    }
  }

  async getUsuarioLogin(datosUsuario) {
    try {

      var usuarioId = await this.UsuarioModel._getUsuarioId(datosUsuario.correoElectronico);
      const usuario = await this._getUsuarioForLogin(usuarioId);
      return usuario;

    } catch (error) {
      if (error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = `Contacto con numero ${numeroIdentificacion} no existe.`;

        throw notFoundError;
      }

      throw error;
    }
  }

  async getUsuarioEmpresa(email) {
    try {

      var usuarioId = await this.UsuarioModel._getUsuarioId(email);
      const usuario = await this._getUsuarioForLogin(usuarioId);
      return usuario;

    } catch (error) {
      if (error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = `Contacto con numero ${numeroIdentificacion} no existe.`;

        throw notFoundError;
      }

      throw error;
    }
  }

  async getUsuarioPerfil(usuario) {
    try {
      return await this.UsuarioModel.findById(usuario.usuarioId);

    } catch (error) {
      if (error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError888');
        notFoundError.details = `Usuario con numero ${usuario.usuarioId} no existe.`;

        throw notFoundError;
      }

      throw error;
    }
  }

  /**
 * Activa o desactiva un producto
 * @param {codigoUsuario} Codigo
 * @param {estadoProductoServicio} ACT/INA
 * @return Mensaje
 */

  async activarDesactivarUsuario(codigoUsuario, estadoUsuario, user) {

    const usuarioId = await this.UsuarioModel._getUsuarioIdByUserCode(user, codigoUsuario);

    if (usuarioId === Globals.ID_NOT_FOUND) {
      const error = new Error('ValidationError');
      error.details = `El Usuario no existe`;
      throw error;
    }

    if (usuarioId === Globals.MORE_THAN_ONE) {
      const error = new Error('ValidationError');
      error.details = `Existe mas de usuario`;
      throw error;
    }

    const usuario = await this.UsuarioModel.findById(usuarioId, { rejectOnEmpty: true });

    const transaction = await this.UsuarioModel.sequelize.transaction();
    if (estadoUsuario === Globals.ACTIVAR) {
      try {
        const usuarioActive = CompleteUsuarioMapper.toEntity(usuario);
        usuarioActive.estadoUsuario = Globals.ACTIVAR;
        const activeUsuario = await usuario.update(
          usuarioActive,
          { transaction });

        await transaction.commit();
        return usuarioActive;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    }
    else if (estadoUsuario === Globals.DESACTIVAR) {
      try {
        const usuarioDeactive = CompleteUsuarioMapper.toEntity(usuario);
        usuarioDeactive.estadoUsuario = Globals.DESACTIVAR;
        const deactiveUsuario = await usuario.update(
          usuarioDeactive,
          { transaction });

        await transaction.commit();
        return usuarioDeactive;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    }
  }

  async changePasswordUsuario(codigoUsuario, user, body) {

    const usuarioId = await this.UsuarioModel._getUsuarioIdByUserCode(user, codigoUsuario);

    if (usuarioId === Globals.ID_NOT_FOUND) {
      const error = new Error('ValidationError');
      error.details = {
        "type": 'error_usuario_notFound',
        "status": 'error',
        "message": `El Usuario no existe.`
      }
      throw error;
    }
    if (usuarioId === Globals.MORE_THAN_ONE) {
      const error = new Error('ValidationError');
      error.details = {
        "type": 'error_usuario_moreThanOne',
        "status": 'error',
        "message": `Existe más de un usuario.`
      }
      throw error;
    }
    const usuario = await this.UsuarioModel.findById(usuarioId, { rejectOnEmpty: true });

    if (body.newPassword === body.confirmNewPassword) {

      let hashedNewPassword = bcrypt.hashSync(body.newPassword, 8);
      const transaction = await this.UsuarioModel.sequelize.transaction();

      try {
        const updatePasswordUser = await usuario.update({ 'password': hashedNewPassword }, { transaction });
        await transaction.commit();
        return usuario;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } else {
      const validacionError = new Error('ValidationError');
      validacionError.details = {
        "type": 'error_newPassword_notMatch',
        "status": 'error',
        "message": `Las nuevas contraseñas no coinciden.`
      }
      throw validacionError;
    }

  }

  async updateUsuarioPerfil(usuario, newData) {
    console.log(usuario);
    const usuarioComplete = await this._getById(usuario.usuarioId);
    const transaction = await this.UsuarioModel.sequelize.transaction();
    try {
      const updatedUsuario = await usuarioComplete.update(newData, { transaction });
      const usuarioEntity = UsuarioMapper.toEntity(updatedUsuario);

      await transaction.commit();
      return usuarioEntity;

    } catch (error) {
      await transaction.rollback();

      throw error;
    }
    //return await this.usuariosRepository.getUsuarioEmpresa(email);
  }
}

module.exports = SequelizeUsuariosRepository;
