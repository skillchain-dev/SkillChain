const express = require('express');
const multer = require('multer');
const { uploadBuffer } = require('../services/cloudinary.service');
const requireAuth = require('../middleware/requireAuth');
const { success, failure } = require('../utils/apiResponse');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

/**
 * POST /api/upload
 * Requires Authorization: Bearer <token>
 * Multipart body:
 *   - file: Binary file (PDF, image, doc)
 *   - folder: Optional subfolder (e.g., 'resumes', 'certificates')
 *
 * Returns: { success: true, data: { url, publicId, format, bytes, originalName } }
 */
router.post('/', requireAuth, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json(failure('NO_FILE_PROVIDED', 'Please provide a file to upload.'));
    }

    const subfolder = req.body?.folder ? String(req.body.folder).replace(/[^a-zA-Z0-9_-]/g, '') : 'uploads';
    const folder = `skillchain/${subfolder}`;

    let result;
    try {
      result = await uploadBuffer(req.file.buffer, {
        folder,
        resource_type: 'auto',
      });
      return res.json(
        success({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes,
          originalName: req.file.originalname,
          source: 'cloudinary',
        })
      );
    } catch (cloudinaryError) {
      console.warn(`[upload] Cloudinary upload notice: ${cloudinaryError.message}. Using safe data-uri fallback.`);
      const mime = req.file.mimetype || 'application/octet-stream';
      const base64Data = req.file.buffer.toString('base64');
      const dataUrl = `data:${mime};base64,${base64Data}`;
      return res.json(
        success({
          url: dataUrl,
          publicId: `local-${Date.now()}`,
          format: req.file.originalname.split('.').pop() || 'bin',
          bytes: req.file.size || req.file.buffer.length,
          originalName: req.file.originalname,
          source: 'local-fallback',
        })
      );
    }
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

