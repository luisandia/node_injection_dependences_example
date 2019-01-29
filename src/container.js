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


const {
    CreateUsuario,

} = require('./app/usuario');
// Operacion para Usuario
container.register({
    createUsuario: asClass(CreateUsuario),
});
console.log("mi create user")
console.log(container.resolve('createUsuario'))
module.exports = container;