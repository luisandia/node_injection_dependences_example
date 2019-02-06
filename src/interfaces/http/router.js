const { Router } = require('express');
const statusMonitor = require('express-status-monitor');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const methodOverride = require('method-override');
const controller = require('./utils/createControllerRoutes');

module.exports = ({ config, containerMiddleware, loggerMiddleware, errorHandler, swaggerMiddleware }) => {
  const router = Router();

  if(config.env === 'development') {
    router.use(statusMonitor());
  }


  if(config.env !== 'test') {
    router.use(loggerMiddleware);
  }

  const apiRouter = Router();

  apiRouter
    .use(methodOverride('X-HTTP-Method-Override'))
    .use(cors())
    .use(bodyParser.json())
    .use(compression())
    .use(containerMiddleware)
    .use('/docs', swaggerMiddleware);

  /*
  * Puntos de entrada a cada modulo
  */
  apiRouter.use('/usuarios', controller('usuarios/UsuariosController'));
  apiRouter.use('/personal', controller('personal/PersonalController'));
  apiRouter.use('/metas', controller('metas/MetasController'));
  router.use('/api', apiRouter);

  router.use(errorHandler);

  return router;
};
