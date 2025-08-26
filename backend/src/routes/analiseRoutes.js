const { Router } = require('express');
const { authHandler } = require('../middlewares/auth');
const analiseController = require('../controllers/analiseController');

const analiseRoutes = Router();

analiseRoutes
  .post('/', authHandler, analiseController.gerar);

module.exports = analiseRoutes;