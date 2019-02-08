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
const cm = require('connect-multiparty');
const md_upload = cm({
  uploadDir: 'src/uploads',
  autoFiles: false
});
const DocumentoController = {
  get router() {
    const router = Router();
    router.use(inject('pageSerializer'));
    router.use(inject('pageSerializerRawQuery'));
    router.post('/upload', md_upload, this.upload);
    router.post('/', inject('createDocumento'), this.create);
    router.get('/', inject('getDocumentoRawQuery'), this.allRawQuery);
    router.put(
      '/:personal_id/:documento_id', inject('updateDocumento'), this.update);
    router.delete(
      '/:personal_id/:documento_id', inject('deleteDocumento'), this.delete);
    router.get(
      '/:personal_id', inject('getDocumentosPersonal'),
      this.getDocumentosPersonal);
    router.get(
      '/:personal_id/:documento_id', inject('getDocumentoPersonal'),
      this.getDocumentoPersonal);

    return router;
  },

  create(req, res, next) {
    console.log('create user');

    const {
      createDocumento
    } = req;
    const {
      SUCCESS,
      ERROR,
      VALIDATION_ERROR
    } = createDocumento.outputs;
    createDocumento
      .on(SUCCESS,
        (usuario) => {
          res.status(Status.CREATED).json({
            status: 'success',
            message: 'Los datos de usuario ' + Globals.MESSAGE_CREACION_PLURAL,
            data: usuario // usuarioSerializer.serialize(usuario)
          });
        })
      .on(VALIDATION_ERROR,
        (error) => {
          res.status(Status.BAD_REQUEST).json({
            type: error.details.type,
            status: error.details.status,
            message: error.details.message
          });
        })
      .on(ERROR, next);

    createDocumento.execute(req.body);
  },
  upload(req, res, next) {
    console.log('create user');;
    // var fs = require('fs');
    // original = req.files.fileKey.name
    // arrayPath = req.files.fileKey.path.split('/')
    // name_alias = arrayPath[arrayPath.length - 1]
    // delete arrayPath[arrayPath.length - 1];
    // new_path = arrayPath.join('/') + original
    // fs.rename(req.files.fileKey.path, new_path, function (err) {
    //   if (err) console.log('ERROR: ' + err);
    // });
    res.status(Status.CREATED).json({
      status: 'success',
      message: 'Los datos de usuario ' + Globals.MESSAGE_CREACION_PLURAL,
      data: req.files.fileKey // usuarioSerializer.serialize(usuario)
    });


  },
  all(req, res, next) {
    const {
      getDocumento,
      pageSerializer,
    } = req;
    const {
      SUCCESS,
      ERROR
    } = getDocumento.outputs;

    getDocumento
      .on(SUCCESS,
        (usuarios) => {
          usuarios.size = Number(req.query.size);
          usuarios.page = Number(req.query.page);
          res.status(Status.OK).json(pageSerializer.serialize(usuarios));
        })
      .on(ERROR, next);

    getDocumento.execute(
      Number(req.query.page), Number(req.query.size), (req.query.value));
  },
  allRawQuery(req, res, next) {
    const {
      getDocumentoRawQuery,
      pageSerializerRawQuery
    } = req;
    const {
      SUCCESS,
      ERROR
    } = getDocumentoRawQuery.outputs;

    getDocumentoRawQuery
      .on(SUCCESS,
        (usuarios) => {
          usuarios.size = Number(req.query.size);
          usuarios.page = Number(req.query.page);
          res.status(Status.OK).json(pageSerializerRawQuery.serialize(
            usuarios, req.query.page, req.query.size));
        })
      .on(ERROR, next);

    getDocumentoRawQuery.execute(
      Number(req.query.page), Number(req.query.size), (req.query.value));
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
    } =
    updateDocumento.outputs;

    updateDocumento
      .on(SUCCESS,
        (usuario) => {
          res.status(Status.ACCEPTED).json({
            status: 'success',
            message: 'Los datos del usuario ' +
              Globals.MESSAGE_ACTUALIZACION_PLURAL,
            data: usuario // usuarioSerializer.serialize(usuario)
          });
        })
      .on(NOT_FOUND,
        (error) => {
          res.status(Status.NOT_FOUND)
            .json({
              type: 'NotFoundError',
              details: error.details
            });
        })
      .on(VALIDATION_ERROR,
        (error) => {
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
      .on(SUCCESS,
        (rpta) => {
          res.status(Status.OK).send({
            tipo: 'send',
            status: 'success',
            message: 'El usuario ' + Globals.MESSAGE_ELIMINACION_SINGULAR_M,
          });
        })

      .on(NOT_FOUND,
        (error) => {
          res.status(Status.NOT_FOUND)
            .json({
              type: 'NotFoundError',
              details: error.details
            });
        })
      .on(ERROR, next);

    deleteDocumento.execute(req.params);
  },
  getDocumentoPersonal(req, res, next) {
    const {
      getDocumentoPersonal,
      pageSerializer,
    } = req;
    const {
      SUCCESS,
      ERROR
    } = getDocumentoPersonal.outputs;

    getDocumentoPersonal
      .on(SUCCESS,
        (usuarios) => {
          res.status(Status.OK).json(usuarios);
        })
      .on(ERROR, next);
    getDocumentoPersonal.execute(req.params);
  },
  getDocumentosPersonal(req, res, next) {
    const {
      getDocumentosPersonal,
      pageSerializer
    } = req;
    const {
      SUCCESS,
      ERROR
    } = getDocumentosPersonal.outputs;

    getDocumentosPersonal
      .on(SUCCESS,
        (usuarios) => {
          usuarios.size = Number(req.query.size);
          usuarios.page = Number(req.query.page);
          res.status(Status.OK).json(pageSerializer.serialize(usuarios));
        })
      .on(ERROR, next);
    req.query.personal_id = req.params.personal_id
    getDocumentosPersonal.execute(req.query);
  }
};

module.exports = DocumentoController;