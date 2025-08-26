const { HttpStatus } = require('node-backend-utils/enums');
const transacaoService = require('../services/transacaoService');

async function listar(req, res, next) {
  try {
    const result = await transacaoService.listar(req.query, req.user);

    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    next(error);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const result = await transacaoService.buscarPorId(parseInt(req.params.id), req.user);

    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    next(error);
  }
}

async function cadastrar(req, res, next) {
  try {
    const result = await transacaoService.cadastrar(req.body, req.user);

    res.status(HttpStatus.CREATED).json(result);
  } catch (error) {
    next(error);
  }
}

async function atualizar(req, res, next) {
  try {
    const result = await transacaoService.atualizar(parseInt(req.params.id), req.body, req.user);

    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    next(error);
  }
}

async function inativar(req, res, next) {
  try {
    await transacaoService.inativar(parseInt(req.params.id), req.user);

    res.status(HttpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listar,
  buscarPorId,
  cadastrar,
  atualizar,
  inativar,
}