const { failure } = require('../utils/apiResponse');

module.exports = (request, response) =>
  response.status(404).json(failure('NOT_FOUND', 'The requested resource was not found.'));