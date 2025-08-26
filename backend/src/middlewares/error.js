const { formatError } = require('node-backend-utils/utils');

// eslint-disable-next-line no-unused-vars
function errorHandler(error, _, res, __) {
  const { statusCode, message } = formatError(error).getJSON();

  res.status(statusCode).json({ message });
}

module.exports = { errorHandler }