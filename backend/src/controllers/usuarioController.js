const { HttpStatus } = require('node-backend-utils/enums');
const { getEnv } = require('../config/dotenv');
const usuarioService = require('../services/usuarioService');

const env = getEnv();

async function buscarPorId(req, res, next) {
  try {
    const result = await usuarioService.buscarPorId(parseInt(req.params.id), req.user);

    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { token, ...user } = await usuarioService.login(req.body);

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      sameSite: 'strict', //Evita CSRF
      maxAge: 1000 * 60 * 60 * 24, //1 dia
      path: '/',
    });

    res.status(HttpStatus.OK).json(user);
  } catch (error) {
    next(error);
  }
}

async function logout(_, res, next) {
  try {
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      sameSite: 'strict', //Evita CSRF
      path: '/',
    });

    res.status(HttpStatus.OK).json({ dataLogout: new Date() });
  } catch (error) {
    next(error);
  }
}

async function cadastrar(req, res, next) {
  try {
    const result = await usuarioService.cadastrar(req.body);

    res.status(HttpStatus.CREATED).json(result);
  } catch (error) {
    next(error);
  }
}

async function atualizar(req, res, next) {
  try {
    const result = await usuarioService.atualizar(parseInt(req.params.id), req.body, req.user);

    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    next(error);
  }
}

async function inativar(req, res, next) {
  try {
    await usuarioService.inativar(parseInt(req.params.id), req.user);

    res.status(HttpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buscarPorId,
  login,
  logout,
  cadastrar,
  atualizar,
  inativar,
}