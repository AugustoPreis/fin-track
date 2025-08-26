const { Router } = require('express');
const { authHandler } = require('../middlewares/auth');
const transacaoController = require('../controllers/transacaoController');

const transacaoRoutes = Router();

transacaoRoutes
  .get('/', authHandler, transacaoController.listar)
  .get('/:id', authHandler, transacaoController.buscarPorId)
  .post('/', authHandler, transacaoController.cadastrar)
  .put('/:id', authHandler, transacaoController.atualizar)
  .delete('/:id', authHandler, transacaoController.inativar);

module.exports = transacaoRoutes;