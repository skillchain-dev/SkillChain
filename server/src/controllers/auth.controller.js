const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User.model');
const { createAccessToken } = require('../utils/authToken');
const { success, failure } = require('../utils/apiResponse');
const { sendPasswordResetEmail, isPasswordResetConfigured } = require('../services/email.service');

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
      accessToken: createAccessToken(user._id, user.tokenVersion || 0),
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
      accessToken: createAccessToken(user._id, user.tokenVersion || 0),
    }));
  } catch (error) {
    return next(error);
  }
}

async function me(request, response, next) {
  try {
    const user = request.user || await User.findById(request.auth.sub);
    if (!user) return response.status(401).json(failure('UNAUTHORIZED', 'The account for this token no longer exists.'));
    return response.json(success({ user: safeUser(user) }));
  } catch (error) {
    return next(error);
  }
}

async function logout(request, response, next) {
  try {
    request.user.tokenVersion = (request.user.tokenVersion || 0) + 1;
    await request.user.save();
    return response.json(success({ loggedOut: true }));
  } catch (error) {
    return next(error);
  }
}

async function requestPasswordReset(request, response) {
  if (!isPasswordResetConfigured()) {
    return response.status(503).json(failure('EMAIL_NOT_CONFIGURED', 'Password reset is temporarily unavailable.'));
  }
  const genericResponse = success({ message: 'If an account exists for that email, a reset link will be sent.' });
  const email = typeof request.body?.email === 'string' ? request.body.email.trim().toLowerCase() : '';
  if (!EMAIL_PATTERN.test(email)) return response.status(400).json(failure('INVALID_EMAIL', 'A valid email address is required.'));
  const user = await User.findOne({ email }).select('+passwordResetTokenHash +passwordResetExpiresAt');
  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    user.passwordResetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    user.passwordResetExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();
    try {
      await sendPasswordResetEmail(user.email, token);
    } catch (error) {
      user.passwordResetTokenHash = undefined;
      user.passwordResetExpiresAt = undefined;
      await user.save();
      console.error('Password reset email delivery failed:', error.message);
    }
  }
  return response.status(202).json(genericResponse);
}

async function resetPassword(request, response) {
  const { token, password } = request.body || {};
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/i.test(token)) {
    return response.status(400).json(failure('INVALID_RESET_TOKEN', 'The reset link is invalid or expired.'));
  }
  if (typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
    return response.status(400).json(failure('INVALID_PASSWORD', 'Password must be between 8 and 72 bytes.'));
  }
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetTokenHash: tokenHash,
    passwordResetExpiresAt: { $gt: new Date() },
  }).select('+passwordResetTokenHash +passwordResetExpiresAt');
  if (!user) return response.status(400).json(failure('INVALID_RESET_TOKEN', 'The reset link is invalid or expired.'));
  user.password = await bcrypt.hash(password, 12);
  user.tokenVersion = (user.tokenVersion || 0) + 1;
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpiresAt = undefined;
  await user.save();
  return response.json(success({ passwordReset: true }));
}

module.exports = { register, login, me, logout, requestPasswordReset, resetPassword };