const { HttpStatus } = require('node-backend-utils/enums');
const categoriaService = require('../services/categoriaService');

async function listar(req, res, next) {
  try {
    const result = await categoriaService.listar(req.query, req.user);

    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    next(error);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const result = await categoriaService.buscarPorId(parseInt(req.params.id), req.user);

    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    next(error);
  }
}

async function cadastrar(req, res, next) {
  try {
    const result = await categoriaService.cadastrar(req.body, req.user);

    res.status(HttpStatus.CREATED).json(result);
  } catch (error) {
    next(error);
  }
}

async function atualizar(req, res, next) {
  try {
    const result = await categoriaService.atualizar(parseInt(req.params.id), req.body, req.user);

    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    next(error);
  }
}

async function inativar(req, res, next) {
  try {
    await categoriaService.inativar(parseInt(req.params.id), req.user);

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