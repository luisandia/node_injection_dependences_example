const { Router } = require('express');
const { inject } = require('awilix-express');
const Status = require('http-status');
const Globals = require('src/utils/Globals');

//JSON web token configuration
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const configToken = require('./configToken');
const verificarToken = require('./VerificarToken');

const privateKeyPath = path.join(__dirname, 'private.key');

const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

const AutorizacionController = {
  get router() {
    const router = Router();

    router.use(inject('usuarioSerializer'));
    router.use(inject('usuarioLoginSerializer'));
    router.use(inject('payloadSerializer'));

    router.post('/registro', inject('createUsuarioPuridiom'), this.create);
    router.post('/login', inject('getUsuarioLogin'), this.usuarioLogin);
    router.post('/forgot', inject('forgotPassword'), this.forgot);
    router.post('/restore', inject('restorePassword'), this.restore);
    router.post('/checkTokenExpires', inject('checkTokenExpires'), this.tokenExpires);
    router.get('/logout', function (req, res) {
      res.status(200).send({ auth: false, token: null });
    });
    router.put('/perfil/password', inject('updateUsuarioPassword'), verificarToken, this.changePassword);

    return router;
  },

  create(req, res, next) {
    const { createUsuarioPuridiom, payloadSerializer, usuarioLoginSerializer } = req;
    const { SUCCESS, ERROR, VALIDATION_ERROR } = createUsuarioPuridiom.outputs;

    createUsuarioPuridiom
      .on(SUCCESS, (usuario) => {
        const newToken = jwt.sign({
          "usuario": payloadSerializer.serialize(usuario)
        },
          privateKey,
          configToken.signOptions);
        res
          .status(Status.CREATED)
          .send({
            auth: true,
            token: newToken,
            status: 'registro',
            info: usuarioLoginSerializer.serialize(usuario)
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

    createUsuarioPuridiom.execute(req.body);
  },

  usuarioLogin(req, res, next) {

    const { getUsuarioLogin, payloadSerializer, usuarioLoginSerializer } = req;
    const { SUCCESS, ERROR, NOT_FOUND } = getUsuarioLogin.outputs;

    getUsuarioLogin
      .on(SUCCESS, (usuario) => {

        var passwordIsValid = bcrypt.compareSync(req.body.password, usuario.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        const newToken = jwt.sign({
          "usuario": payloadSerializer.serialize(usuario)
        },
          privateKey,
          configToken.signOptions
        );

        res
          .status(Status.OK)
          .send({
            auth: true,
            token: newToken,
            status: 'login',
            info: usuarioLoginSerializer.serialize(usuario)
          });
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          details: error.details
        });
      })
      .on(ERROR, next);

    getUsuarioLogin.execute(req.body);
  },

  forgot(req, res, next) {
    const { forgotPassword } = req;
    const { SUCCESS, NOT_FOUND, ERROR } = forgotPassword.outputs;

    forgotPassword
      .on(SUCCESS, (usuario) => {
        res
          .status(Status.OK)
          .send({
            tipo: 'send',
            status: 'success',
            message: `Se mando un mensaje a ${usuario.correoElectronico} para restablecer la contraseña.`
          });
      })
      .on(NOT_FOUND, (error) => {
        res
          .status(Status.OK)
          .send({
            tipo: 'send',
            status: 'email_error',
            message: 'Este correo electrónico no existe.'
          });
      })
      .on(ERROR, next);

    forgotPassword.execute(req.body);
  },

  restore(req, res, next) {
    const { restorePassword, payloadSerializer, usuarioLoginSerializer } = req;
    const { SUCCESS, NOT_FOUND, ERROR } = restorePassword.outputs;

    restorePassword
      .on(SUCCESS, (usuario) => {
        const newToken = jwt.sign({
          "usuario": payloadSerializer.serialize(usuario)
        },
          privateKey,
          configToken.signOptions
        );

        res
          .status(Status.OK)
          .send({
            auth: true,
            token: newToken,
            info: usuarioLoginSerializer.serialize(usuario)
          });

      })
      .on(NOT_FOUND, (error) => {
        res
          .status(Status.NOT_FOUND)
          .json({
            type: 'NotFoundError',
            details: error.details
          });
      })
      .on(ERROR, next);

    restorePassword.execute(req.body.token, req.body.newPassword);
  },

  tokenExpires(req, res, next) {

    const { checkTokenExpires } = req;
    const { SUCCESS, NOT_FOUND, ERROR } = checkTokenExpires.outputs;

    checkTokenExpires
      .on(SUCCESS, (usuario) => {
        res
          .status(Status.OK)
          .send({
            tipo: 'send',
            status: 'success',
            message: `La contraseña si puede ser actualizada`
          });

      })
      .on(NOT_FOUND, (error) => {
        res
          .status(Status.OK)
          .send({
            tipo: 'send',
            status: 'invalid_token',
            message: `El token ha expirado`
          });
      })
      .on(ERROR, next);

    checkTokenExpires.execute(req.body.token);
  },

  changePassword(req, res, next) {
    const { updateUsuarioPassword, payloadSerializer } = req;
    const { SUCCESS, ERROR, VALIDATION_ERROR, NOT_FOUND } = updateUsuarioPassword.outputs;

    updateUsuarioPassword
      .on(SUCCESS, (usuario) => {
        const newToken = jwt.sign({
          "usuario": payloadSerializer.serialize(usuario)
        },
          privateKey,
          configToken.signOptions
        );
        res
          .status(Status.ACCEPTED)
          .json({
            "status": "success",
            "message": "La contraseña " + Globals.MESSAGE_ACTUALIZACION_SINGULAR_F,
            auth: true,
            token: newToken
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
    updateUsuarioPassword.execute(req.user, req.body);
  }

};

module.exports = AutorizacionController;
