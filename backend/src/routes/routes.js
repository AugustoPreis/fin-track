const { Router } = require('express');
const usuarioRoutes = require('./usuarioRoutes');
const categoriaRoutes = require('./categoriaRoutes');
const transacaoRoutes = require('./transacaoRoutes');
const analiseRoutes = require('./analiseRoutes');

const routes = Router();

routes.use('/usuarios', usuarioRoutes);
routes.use('/categorias', categoriaRoutes);
routes.use('/transacoes', transacaoRoutes);
routes.use('/analises', analiseRoutes);

module.exports = routes;