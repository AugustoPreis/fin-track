const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { logger } = require('node-backend-utils/utils');
const { getEnv } = require('./config/dotenv');
const { errorHandler } = require('./middlewares/error');
const database = require('./config/database');
const routes = require('./routes/routes');

const app = express();
const env = getEnv();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/v1', routes);
app.use(errorHandler);

database.test((dbError) => {
  if (dbError) {
    logger.error('Erro ao conectar ao banco de dados:', dbError);

    process.exit(1);
  }

  app.listen(env.port, () => {
    logger.info(`Servidor iniciado na porta ${env.port}`);
  });
});

module.exports = { app }