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

const PersonalController = {
  get router() {
    const router = Router();
    router.use(inject('pageSerializer'));
    router.get('/', inject('getPersonal'), this.all);
    router.post('/', inject('createPersonal'), this.create); 
    router.put('/:personal_id', inject('updatePersonal'), this.update);
    router.delete('/:personal_id', inject('deletePersonal'), this.delete);

    return router;
  },

  create(req, res, next) {
    console.log("create user");

    const {
      createPersonal
    } = req;
    const {
      SUCCESS,
      ERROR,
      VALIDATION_ERROR
    } = createPersonal.outputs;
    createPersonal
      .on(SUCCESS, (usuario) => {
        res.status(Status.CREATED)
          .json({
            status: "success",
            message: "Los datos de usuario " + Globals.MESSAGE_CREACION_PLURAL,
            data: usuario // usuarioSerializer.serialize(usuario)
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

    createPersonal.execute(req.body);

  },
  all(req, res, next) {


    const {
      getPersonal,
      pageSerializer
    } = req;
    const {
      SUCCESS,
      ERROR
    } = getPersonal.outputs;

    getPersonal
      .on(SUCCESS, (usuarios) => {
        usuarios.size = Number(req.query.size);
        usuarios.page = Number(req.query.page);
        res
          .status(Status.OK)
          .json(pageSerializer.serialize(usuarios));
      })
      .on(ERROR, next);

    getPersonal.execute(Number(req.query.page), Number(req.query.size));
  },

  update(req, res, next) {
    const {
      updatePersonal,
      // usuarioSerializer
    } = req;
    const {
      SUCCESS,
      ERROR,
      NOT_FOUND,
      VALIDATION_ERROR
    } = updatePersonal.outputs;

    updatePersonal
      .on(SUCCESS, (usuario) => {
        res
          .status(Status.ACCEPTED)
          .json({
            status: "success",
            message: "Los datos del usuario " + Globals.MESSAGE_ACTUALIZACION_PLURAL,
            data: usuario //usuarioSerializer.serialize(usuario)
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

    updatePersonal.execute(req.params, req.body);
  },

  delete(req, res, next) {
    const {
      deletePersonal
    } = req;
    const {
      SUCCESS,
      ERROR,
      NOT_FOUND
    } = deletePersonal.outputs;

    deletePersonal
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

    deletePersonal.execute(req.params);
  },
};

module.exports = PersonalController;