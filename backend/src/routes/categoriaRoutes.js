const { Router } = require('express');
const { authHandler } = require('../middlewares/auth');
const categoriaController = require('../controllers/categoriaController');

const categoriaRoutes = Router();

categoriaRoutes
  .get('/', authHandler, categoriaController.listar)
  .get('/:id', authHandler, categoriaController.buscarPorId)
  .post('/', authHandler, categoriaController.cadastrar)
  .put('/:id', authHandler, categoriaController.atualizar)
  .delete('/:id', authHandler, categoriaController.inativar);

module.exports = categoriaRoutes;