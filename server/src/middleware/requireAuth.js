const { failure } = require('../utils/apiResponse');
const { verifyAccessToken } = require('../utils/authToken');
const User = require('../models/User.model');

async function requireAuth(request, response, next) {
  const authorization = request.get('authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  const claims = match && verifyAccessToken(match[1]);
  if (!claims) {
    return response.status(401).json(failure('UNAUTHORIZED', 'A valid access token is required.'));
  }

  try {
    const user = await User.findById(claims.sub);
    if (!user || (user.tokenVersion || 0) !== claims.ver) {
      return response.status(401).json(failure('UNAUTHORIZED', 'A valid access token is required.'));
    }
    request.auth = claims;
    request.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = requireAuth;
