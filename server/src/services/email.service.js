const nodemailer = require('nodemailer');
const { clientBaseUrl, smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom, smtpSecure } = require('../config/env');

let transport;

function getTransport() {
  if (!smtpHost || !smtpFrom) {
    if (process.env.NODE_ENV === 'production') throw new Error('SMTP_HOST and SMTP_FROM must be configured in production.');
    return null;
  }
  if (!transport) {
    transport = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: smtpUser ? { user: smtpUser, pass: smtpPass } : undefined,
    });
  }
  return transport;
}

function isPasswordResetConfigured() {
  return process.env.NODE_ENV !== 'production' || Boolean(smtpHost && smtpFrom);
}

async function sendPasswordResetEmail(email, token) {
  const resetUrl = `${clientBaseUrl.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(token)}`;
  const mailer = getTransport();
  if (!mailer) {
    console.info(`[password-reset] Development reset link for ${email}: ${resetUrl}`);
    return;
  }
  await mailer.sendMail({
    from: smtpFrom,
    to: email,
    subject: 'Reset your SkillChain password',
    text: `Use this link to reset your password. It expires in 30 minutes:\n\n${resetUrl}\n\nIf you did not request a reset, ignore this email.`,
  });
}

module.exports = { sendPasswordResetEmail, isPasswordResetConfigured };