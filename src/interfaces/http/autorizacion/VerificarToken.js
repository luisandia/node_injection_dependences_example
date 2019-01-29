'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const configToken = require('./configToken');
const fs = require('fs');
const path = require('path');

const publicKeyPath = path.join(__dirname, 'public.key')
const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

//Payload
const usuario = {
  empresaId: "default",
  sucursalId: "default",
  puntoVentaId: "default",
  almacenId: "default",
  usuarioId: "default",
  correoElectronico: "default"
}

function VerificarToken(req, res, next) {
  const TOKEN = req.headers['token'];
  if (!TOKEN) {
    return res.status(403).send({ auth: false, message: 'Token not Found.' });
  }
  const token = TOKEN.split(',')[0];
  jwt.verify(token, publicKey, configToken.verifyOptions, function(err, decoded) {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Invalid Token.' });
    }
    req.user = decoded.usuario;
    next();
  });
}

module.exports = VerificarToken;