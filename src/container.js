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
    GetMetas
} = require('./app/metas');
container.register({
    createMetas: asClass(CreateMetas),
    updateMetas: asClass(UpdateMetas),
    deleteMetas: asClass(DeleteMetas),
    getMetas: asClass(GetMetas)
});







/*************************** DATABASE AND REPOSITORIES****************************/

const SequelizePersonalRepository = require('./infra/personal/SequelizePersonalRepository');
const SequelizeMetasRepository = require('./infra/metas/SequelizeMetasRepository');
container.register({
    personalRepository: asClass(SequelizePersonalRepository).singleton(),
    metasRepository: asClass(SequelizeMetasRepository).singleton(),
});

const {
    database,
    Usuario: UsuarioModel,
    personal:PersonalModel,
    personal_metas:MetasModel,
} = require('./infra/database/models');
container.register({
    database: asValue(database),
    UsuarioModel: asValue(UsuarioModel),
    PersonalModel: asValue(PersonalModel),
    MetasModel: asValue(MetasModel),

});




/************************* SERIALIZADORES ***************************/
const UsuariosPageSerializer = require('./interfaces/http/usuarios/UsuariosPageSerializer');
const PageSerializer = require('./utils/PageSerializer');
container.register({
  usuariosPageSerializer: asValue(UsuariosPageSerializer),
  pageSerializer: asValue(PageSerializer),
});



module.exports = container;