const { failure } = require('../utils/apiResponse');
const { verifyAccessToken } = require('../utils/authToken');

function requireAuth(request, response, next) {
  const authorization = request.get('authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  const claims = match && verifyAccessToken(match[1]);
  if (!claims) {
    return response.status(401).json(failure('UNAUTHORIZED', 'A valid access token is required.'));
  }

  request.auth = claims;
  return next();
}

module.exports = requireAuth;
