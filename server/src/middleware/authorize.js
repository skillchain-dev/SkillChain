const User = require('../models/User.model');
const { failure } = require('../utils/apiResponse');

function authorize(...roles) {
  return async (request, response, next) => {
    try {
      const user = request.user || await User.findById(request.auth?.sub);
      if (!user) {
        return response.status(401).json(failure('UNAUTHORIZED', 'The account for this token no longer exists.'));
      }
      if (roles.length && !roles.includes(user.role)) {
        return response.status(403).json(failure('FORBIDDEN', 'You do not have permission to perform this action.'));
      }
      request.user = user;
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = authorize;