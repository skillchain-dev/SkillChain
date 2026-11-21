const { failure } = require('../utils/apiResponse');

module.exports = (error, request, response, next) => {
  if (response.headersSent) return next(error);
  const status = Number.isInteger(error.status) && error.status >= 400 && error.status < 600
    ? error.status
    : error.name === 'ValidationError'
      ? 400
      : error.code === 11000
        ? 409
        : 500;
  const code = error.code === 11000 ? 'DUPLICATE_RESOURCE' : error.code || (status === 500 ? 'INTERNAL_ERROR' : 'REQUEST_FAILED');
  if (status >= 500) console.error(error);
  return response.status(status).json(failure(
    code,
    status === 500 ? 'An unexpected error occurred.' : error.message || 'The request could not be completed.'
  ));
};