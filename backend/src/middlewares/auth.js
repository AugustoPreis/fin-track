const { UnauthorizedError } = require('node-backend-utils/classes');
const { isValidString } = require('node-backend-utils/validators');
const { verifyJWT } = require('node-backend-utils/auth');
const { getEnv } = require('../config/dotenv');

const env = getEnv();

function authHandler(req, _, next) {
  const { authToken } = req.cookies;

  if (!isValidString(authToken)) {
    throw new UnauthorizedError('Usuário não autenticado');
  }

  verifyJWT(authToken, env.jwtSecret).then((decoded) => {
    req.user = decoded;

    next();
  }).catch((err) => {
    next(new UnauthorizedError(err.message));
  });
}


module.exports = { authHandler }