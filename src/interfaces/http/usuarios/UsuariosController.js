const {
  Router
} = require('express');
const {
  inject
} = require('awilix-express');
const Status = require('http-status');
// const verificarToken = require('./../autorizacion/VerificarToken');
const Globals = require('src/utils/Globals');
const verificarToken = require('../autorizacion/VerificarToken');

const UsuariosController = {

  get router() {
    const router = Router();
    // const api = makeInvoker(TodoAPI)

    // router.use(inject('usuarioSerializer'));
    // router.use(inject('usuarioLoginSerializer'));
    router.use(inject('usuariosPageSerializer'));

    router.get('/list', inject('getAllUsuarios'), this.all); //lista usuario
    // router.post('/list', inject('getAllUsuariosByPageSizeAndBodyJSON'), verificarToken, this.allUsuariosByPageSizeAndBodyJSON); //lista usuario
    // router.get('/:codigoUsuario', inject('getUsuarioByCodigoUsuario'), verificarToken, this.show);
    // router.get('/', api('create')); //create
    router.post('/create', inject('createUsuario'),this.create); //create
    // router.put('/:codigoUsuario', inject('updateUsuario'), verificarToken, this.update);
    // router.delete('/:codigoUsuario', inject('deleteUsuario'), verificarToken, this.delete);

    return router;
  },

  create(req, res, next) {
    console.log("create user");
    
    const {createUsuario} =req;
    const { SUCCESS, ERROR, VALIDATION_ERROR } = createUsuario.outputs;
    createUsuario.on(SUCCESS, (usuario) => {
        res
          .status(Status.CREATED)
          .json({
            status: "success",
            message: "Los datos de usuario "+Globals.MESSAGE_CREACION_PLURAL,
            data: usuario// usuarioSerializer.serialize(usuario)
          });
      })
      .on(VALIDATION_ERROR, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: error.details.type,
          status: error.details.status,
          message: error.details.message
        });
      })    
      .on(ERROR, next);

    createUsuario.execute(req.body);
    
  },
  all(req, res, next) {

    
    const {
      getAllUsuarios,
      usuariosPageSerializer
    } = req;
    const {
      SUCCESS,
      ERROR
    } = getAllUsuarios.outputs;

    getAllUsuarios
      .on(SUCCESS, (usuarios) => {
        usuarios.size = Number(req.query.size);
        usuarios.page = Number(req.query.page);
        res
          .status(Status.OK)
          .json(usuariosPageSerializer.serialize(usuarios));
      })
      .on(ERROR, next);

    getAllUsuarios.execute( Number(req.query.page), Number(req.query.size));
  },

  update(req, res, next) {
    const {
      updateUsuario,
      usuarioSerializer
    } = req;
    const {
      SUCCESS,
      ERROR,
      NOT_FOUND,
      VALIDATION_ERROR
    } = updateUsuario.outputs;

    updateUsuario
      .on(SUCCESS, (usuario) => {
        res
          .status(Status.ACCEPTED)
          .json({
            status: "success",
            message: "Los datos del usuario " + Globals.MESSAGE_ACTUALIZACION_PLURAL,
            data: usuarioSerializer.serialize(usuario)
          });
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details
        });
      })
      .on(VALIDATION_ERROR, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: error.details.type,
          status: error.details.status,
          message: error.details.message
        });
      })
      .on(ERROR, next);

    updateUsuario.execute(req.params, req.user, req.body);
  },

  delete(req, res, next) {
    const {
      deleteUsuario
    } = req;
    const {
      SUCCESS,
      ERROR,
      NOT_FOUND
    } = deleteUsuario.outputs;

    deleteUsuario
      /*       .on(SUCCESS, () => {
              res.status(Status.ACCEPTED).end();
            }) */
      .on(SUCCESS, (rpta) => {
        res
          .status(Status.OK)
          .send({
            tipo: 'send',
            status: 'success',
            message: "El usuario " + Globals.MESSAGE_ELIMINACION_SINGULAR_M,
          });
      })

      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details
        });
      })
      .on(ERROR, next);

    deleteUsuario.execute(req.user, req.params);
  },

  getUsuarioPerfil(req, res, next) {
    const {
      getUsuarioPerfil,
      usuarioSerializer
    } = req;
    const {
      SUCCESS,
      ERROR
    } = getUsuarioPerfil.outputs;
    getUsuarioPerfil
      .on(SUCCESS, (usuario) => {
        res
          .status(Status.OK)
          .json(usuario);
      })
      .on(ERROR, next);
    getUsuarioPerfil.execute(req.user);
  },
};

module.exports = UsuariosController;