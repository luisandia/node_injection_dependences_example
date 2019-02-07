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

const DocumentoController = {
  get router() {
    const router = Router();
    router.use(inject('pageSerializer'));
    router.get('/', inject('getDocumento'), this.all);
    router.get('/:documento_id', inject('getDocumentoById'), this.get);
    router.post('/', inject('createDocumento'), this.create);
    router.put('/:documento_id', inject('updateDocumento'), this.update);
    router.delete('/:documento_id', inject('deleteDocumento'), this.delete);
    return router;
  },

  create(req, res, next) {
    console.log("create user");

    const {
      createDocumento
    } = req;
    const {
      SUCCESS,
      ERROR,
      VALIDATION_ERROR
    } = createDocumento.outputs;
    createDocumento
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
    createDocumento.execute(req.body);
  },
  all(req, res, next) {
    const {
      getDocumento,
      pageSerializer
    } = req;
    const {
      SUCCESS,
      ERROR
    } = getDocumento.outputs;

    getDocumento
      .on(SUCCESS, (usuarios) => {
        usuarios.size = Number(req.query.size);
        usuarios.page = Number(req.query.page);
        res
          .status(Status.OK)
          .json(pageSerializer.serialize(usuarios));
      })
      .on(ERROR, next);

    getDocumento.execute(Number(req.query.page), Number(req.query.size));
  },
  get(req, res, next) {

    const {
      getDocumentoById
    } = req;
    const {
      SUCCESS,
      ERROR
    } = getDocumentoById.outputs;

    getDocumentoById
      .on(SUCCESS, (usuarios) => {
        res
          .status(Status.OK)
          .json(usuarios);
      })
      .on(ERROR, next);

    getDocumentoById.execute(req.params);
  },

  update(req, res, next) {
    const {
      updateDocumento,
      // usuarioSerializer
    } = req;
    const {
      SUCCESS,
      ERROR,
      NOT_FOUND,
      VALIDATION_ERROR
    } = updateDocumento.outputs;

    updateDocumento
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

    updateDocumento.execute(req.params, req.body);
  },

  delete(req, res, next) {
    const {
      deleteDocumento
    } = req;
    const {
      SUCCESS,
      ERROR,
      NOT_FOUND
    } = deleteDocumento.outputs;

    deleteDocumento
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

    deleteDocumento.execute(req.params);
  },
};

module.exports = DocumentoController;