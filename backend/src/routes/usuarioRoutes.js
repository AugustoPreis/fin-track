const { Router } = require('express');
const { authHandler } = require('../middlewares/auth');
const usuarioController = require('../controllers/usuarioController');

const usuarioRoutes = Router();

usuarioRoutes
  .get('/:id', authHandler, usuarioController.buscarPorId)
  .post('/login', usuarioController.login)
  .post('/', usuarioController.cadastrar)
  .put('/:id', authHandler, usuarioController.atualizar)
  .delete('/logout', authHandler, usuarioController.logout)
  .delete('/:id', authHandler, usuarioController.inativar);

module.exports = usuarioRoutes;