const { HttpStatus } = require('node-backend-utils/enums');
const analiseService = require('../services/analiseService');

async function gerar(req, res, next) {
  try {
    const result = await analiseService.gerar(req.body, req.user);

    res.status(HttpStatus.CREATED).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = { gerar }