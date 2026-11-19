const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const { createAccessToken } = require('../utils/authToken');
const { success, failure } = require('../utils/apiResponse');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGISTERABLE_ROLES = ['student', 'recruiter'];

function safeUser(user) {
  return {
    _id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
  };
}

function validateCredentials({ name, email, password, role }, isRegistration) {
  if (isRegistration && (typeof name !== 'string' || name.trim().length < 2)) {
    return 'Name must be at least 2 characters.';
  }
  if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim())) {
    return 'A valid email address is required.';
  }
  if (typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
    return 'Password must be between 8 and 72 bytes.';
  }
  if (isRegistration && role !== undefined && !REGISTERABLE_ROLES.includes(role)) {
    return 'Role must be student or recruiter.';
  }
  return null;
}

async function register(request, response, next) {
  const { name, email, password, role } = request.body || {};
  const validationError = validateCredentials({ name, email, password, role }, true);
  if (validationError) return response.status(400).json(failure('INVALID_REGISTRATION', validationError));

  try {
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: await bcrypt.hash(password, 12),
      role: role || 'student',
    });
    return response.status(201).json(success({
      user: safeUser(user),
      accessToken: createAccessToken(user._id),
    }));
  } catch (error) {
    if (error.code === 11000) {
      return response.status(409).json(failure('EMAIL_ALREADY_REGISTERED', 'An account with that email already exists.'));
    }
    return next(error);
  }
}

async function login(request, response, next) {
  const { email, password } = request.body || {};
  const validationError = validateCredentials({ email, password }, false);
  if (validationError) return response.status(400).json(failure('INVALID_LOGIN', validationError));

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return response.status(401).json(failure('INVALID_CREDENTIALS', 'Email or password is incorrect.'));
    }
    return response.json(success({
      user: safeUser(user),
      accessToken: createAccessToken(user._id),
    }));
  } catch (error) {
    return next(error);
  }
}

async function me(request, response, next) {
  try {
    const user = await User.findById(request.auth.sub);
    if (!user) return response.status(401).json(failure('UNAUTHORIZED', 'The account for this token no longer exists.'));
    return response.json(success({ user: safeUser(user) }));
  } catch (error) {
    return next(error);
  }
}

function logout(request, response) {
  return response.json(success({ loggedOut: true }));
}

module.exports = { register, login, me, logout };