const {
  createContainer,
  asClass,
  asFunction,
  asValue
} = require('awilix');
const {
  scopePerRequest
} = require('awilix-express');
const config = require('../config');
const Application = require('./app/Application');


/*
 * Configuracion para el servidor
 */

const Server = require('./interfaces/http/Server');
const router = require('./interfaces/http/router');
const loggerMiddleware = require('./interfaces/http/logging/loggerMiddleware');
const errorHandler = require('./interfaces/http/errors/errorHandler');
const devErrorHandler = require('./interfaces/http/errors/devErrorHandler');
const swaggerMiddleware = require('./interfaces/http/swagger/swaggerMiddleware');
const logger = require('./infra/logging/logger');

const container = createContainer();

// System
container
  .register({
    app: asClass(Application).singleton(),
    server: asClass(Server).singleton()
  })
  .register({
    router: asFunction(router).singleton(),
    logger: asFunction(logger).singleton()
  })
  .register({
    config: asValue(config)
  });


// Middlewares
container
  .register({
    loggerMiddleware: asFunction(loggerMiddleware).singleton()
  })
  .register({
    containerMiddleware: asValue(scopePerRequest(container)),
    errorHandler: asValue(config.production ? errorHandler : devErrorHandler),
    swaggerMiddleware: asValue([swaggerMiddleware])
  });

/***************************  USUARIO  *******************************/
const {
  CreateUsuario,
  GetAllUsuarios
} = require('./app/usuario');
container.register({
  createUsuario: asClass(CreateUsuario),
  getAllUsuarios: asClass(GetAllUsuarios),
});

const SequelizeUsuariosRepository = require('./infra/usuario/SequelizeUsuariosRepository');
container.register({
  usuariosRepository: asClass(SequelizeUsuariosRepository).singleton(),
});

/*************************** METAS *****************************/
const {
  CreateMetas,
  UpdateMetas,
  DeleteMetas,
  GetMetas,
  GetMetasRawQuery,
  GetMetasPersonal,
  GetMetaPersonal
} = require('./app/metas');
container.register({
  createMetas: asClass(CreateMetas),
  updateMetas: asClass(UpdateMetas),
  deleteMetas: asClass(DeleteMetas),
  getMetas: asClass(GetMetas),
  getMetasRawQuery: asClass(GetMetasRawQuery),
  getMetasPersonal: asClass(GetMetasPersonal),
  getMetaPersonal: asClass(GetMetaPersonal)
});


/*************************** DOCUMENTOS *****************************/
const {
  CreateDocumento,
  UpdateDocumento,
  DeleteDocumento,
  GetDocumento,
  GetDocumentoRawQuery,
  GetDocumentoPersonal,
  GetDocumentosPersonal,
} = require('./app/documentos');
container.register({
  createDocumento: asClass(CreateDocumento),
  updateDocumento: asClass(UpdateDocumento),
  deleteDocumento: asClass(DeleteDocumento),
  getDocumento: asClass(GetDocumento),
  getDocumentoRawQuery: asClass(GetDocumentoRawQuery),
  getDocumentoPersonal: asClass(GetDocumentoPersonal),
  getDocumentosPersonal: asClass(GetDocumentosPersonal),
});


/*************************** PERSONAL *****************************/

const {
  CreatePersonal,
  UpdatePersonal,
  DeletePersonal,
  GetPersonal,
  GetPersonalById,
} = require('./app/personal');
container.register({
  createPersonal: asClass(CreatePersonal),
  updatePersonal: asClass(UpdatePersonal),
  deletePersonal: asClass(DeletePersonal),
  getPersonal: asClass(GetPersonal),
  getPersonalById: asClass(GetPersonalById)
});







/*************************** DATABASE AND REPOSITORIES****************************/

const SequelizePersonalRepository = require('./infra/personal/SequelizePersonalRepository');
const SequelizeMetasRepository = require('./infra/metas/SequelizeMetasRepository');
const SequelizeDocumentoRepository = require('./infra/documentos/SequelizeDocumentoRepository');
container.register({
  personalRepository: asClass(SequelizePersonalRepository).singleton(),
  metasRepository: asClass(SequelizeMetasRepository).singleton(),
  documentoRepository: asClass(SequelizeDocumentoRepository).singleton(),
});

const {
  database,
  Usuario: UsuarioModel,
  personal: PersonalModel,
  personal_metas: MetasModel,
  personal_documentos: DocumentoModel
} = require('./infra/database/models');
container.register({
  database: asValue(database),
  UsuarioModel: asValue(UsuarioModel),
  PersonalModel: asValue(PersonalModel),
  MetasModel: asValue(MetasModel),
  DocumentoModel: asValue(DocumentoModel),

});




/************************* SERIALIZADORES ***************************/
const UsuariosPageSerializer = require('./interfaces/http/usuarios/UsuariosPageSerializer');
const PageSerializer = require('./utils/PageSerializer');
const PageSerializerRawQuery = require('./utils/PageSerializerRawQuery');
container.register({
  usuariosPageSerializer: asValue(UsuariosPageSerializer),
  pageSerializer: asValue(PageSerializer),
  pageSerializerRawQuery: asValue(PageSerializerRawQuery),
});



module.exports = container;