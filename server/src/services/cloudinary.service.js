const cloudinary = require('cloudinary').v2;
const { cloudinary: config } = require('../config/env');

cloudinary.config({
  cloud_name: config.cloudName || '',
  api_key: config.apiKey || '',
  api_secret: config.apiSecret || '',
  secure: true,
});

/**
 * Uploads an in-memory file buffer directly to Cloudinary.
 *
 * @param {Buffer} buffer
 * @param {object} options
 * @returns {Promise<object>} Cloudinary upload result with secure_url, public_id, etc.
 */
async function uploadBuffer(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'skillchain',
        resource_type: options.resource_type || 'auto',
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

module.exports = { cloudinary, uploadBuffer };
