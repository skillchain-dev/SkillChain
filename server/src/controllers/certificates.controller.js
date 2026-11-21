const crypto = require('crypto');
const mongoose = require('mongoose');
const Certificate = require('../models/Certificate.model');
const { success, failure } = require('../utils/apiResponse');
const { issueCredential } = require('../services/blockchain.service');

async function create(request, response) {
  const { title, issuer, issueDate, fileUrl } = request.body || {};
  if (typeof title !== 'string' || !title.trim() || typeof issuer !== 'string' || !issuer.trim()) {
    return response.status(400).json(failure('INVALID_CERTIFICATE', 'Certificate title and issuer are required.'));
  }
  const certificateId = crypto.randomUUID();
  const certificateHash = crypto.createHash('sha256')
    .update(JSON.stringify({ certificateId, student: request.auth.sub, title: title.trim(), issuer: issuer.trim(), issueDate: issueDate || null }))
    .digest('hex');
  const certificate = await Certificate.create({
    certificateId,
    student: request.auth.sub,
    title: title.trim(),
    issuer: issuer.trim(),
    issueDate: issueDate ? new Date(issueDate) : undefined,
    fileUrl: typeof fileUrl === 'string' ? fileUrl.trim() : '',
    certificateHash,
  });
  return response.status(201).json(success(certificate));
}

async function mine(request, response) {
  const certificates = await Certificate.find({ student: request.auth.sub }).sort({ createdAt: -1 }).lean();
  return response.json(success({ certificates }));
}

async function pending(request, response) {
  const certificates = await Certificate.find({ status: 'pending' })
    .populate('student', 'name email')
    .sort({ createdAt: 1 })
    .lean();
  return response.json(success({ certificates }));
}

async function get(request, response) {
  const certificate = await Certificate.findOne({ certificateId: request.params.certificateId })
    .populate('student', 'name email')
    .lean();
  if (!certificate) return response.status(404).json(failure('CERTIFICATE_NOT_FOUND', 'Certificate not found.'));
  if (request.user.role !== 'admin' && String(certificate.student?._id) !== String(request.user._id)) {
    return response.status(403).json(failure('FORBIDDEN', 'You cannot view this certificate.'));
  }
  return response.json(success({ certificate }));
}

async function review(request, response) {
  const { decision, reviewNote = '' } = request.body || {};
  if (!['approved', 'rejected'].includes(decision)) return response.status(400).json(failure('INVALID_DECISION', 'Decision must be approved or rejected.'));
  const certificate = await Certificate.findOne({ certificateId: request.params.certificateId });
  if (!certificate) return response.status(404).json(failure('CERTIFICATE_NOT_FOUND', 'Certificate not found.'));
  if (certificate.status !== 'pending') return response.status(409).json(failure('CERTIFICATE_ALREADY_REVIEWED', 'This certificate has already been reviewed.'));
  if (decision === 'approved') {
    try {
      const chain = await issueCredential(certificate.certificateId, certificate.certificateHash, certificate.student);
      certificate.chainTxHash = chain.transactionHash;
      certificate.chainCredentialId = chain.credentialId;
    } catch (chainError) {
      if (process.env.NODE_ENV === 'production') {
        throw chainError;
      }
      console.warn(`[blockchain] Local credential issued off-chain only (${chainError.message})`);
      certificate.chainCredentialId = `local-${certificate.certificateId}`;
      certificate.chainTxHash = `0xlocaldev${Date.now()}`;
    }
  }
  certificate.status = decision;
  certificate.reviewedBy = request.user._id;
  certificate.reviewNote = String(reviewNote).slice(0, 1000);
  await certificate.save();
  return response.json(success(certificate));
}

async function remove(request, response) {
  if (!mongoose.isValidObjectId(request.params.id)) return response.status(404).json(failure('CERTIFICATE_NOT_FOUND', 'Certificate not found.'));
  const certificate = await Certificate.findOne({ _id: request.params.id, student: request.auth.sub });
  if (!certificate) return response.status(404).json(failure('CERTIFICATE_NOT_FOUND', 'Certificate not found.'));
  if (certificate.status !== 'pending') return response.status(409).json(failure('CERTIFICATE_ALREADY_REVIEWED', 'Only pending certificates can be deleted.'));
  await certificate.deleteOne();
  return response.json(success({ deleted: true }));
}

module.exports = { create, mine, pending, get, review, remove };