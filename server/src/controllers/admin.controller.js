const Application = require('../models/Application.model');
const Certificate = require('../models/Certificate.model');
const Job = require('../models/Job.model');
const User = require('../models/User.model');
const mongoose = require('mongoose');
const { success, failure } = require('../utils/apiResponse');

async function stats(request, response) {
  const [students, recruiters, jobs, pending, approved, rejected] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'recruiter' }),
    Job.countDocuments(),
    Certificate.countDocuments({ status: 'pending' }),
    Certificate.countDocuments({ status: 'approved' }),
    Certificate.countDocuments({ status: 'rejected' }),
  ]);
  return response.json(success({ students, recruiters, jobs, applications: await Application.countDocuments(), verification: { pending, approved, rejected } }));
}

async function students(request, response) {
  const records = await User.find({ role: 'student' }).select('name email createdAt').sort({ createdAt: -1 }).lean();
  return response.json(success({ students: records }));
}

async function recruiters(request, response) {
  const records = await User.find({ role: 'recruiter' }).select('name email createdAt').sort({ createdAt: -1 }).lean();
  return response.json(success({ recruiters: records }));
}

async function jobs(request, response) {
  const records = await Job.find().populate('recruiter', 'name email').sort({ createdAt: -1 }).lean();
  return response.json(success({ jobs: records }));
}

async function moderateJob(request, response) {
  if (!mongoose.isValidObjectId(request.params.id)) return response.status(404).json(failure('JOB_NOT_FOUND', 'Job not found.'));
  if (!['open', 'closed', 'draft'].includes(request.body?.status)) {
    return response.status(400).json(failure('INVALID_JOB_STATUS', 'Status must be open, closed, or draft.'));
  }
  const job = await Job.findByIdAndUpdate(request.params.id, { status: request.body.status }, { new: true, runValidators: true });
  if (!job) return response.status(404).json(failure('JOB_NOT_FOUND', 'Job not found.'));
  return response.json(success(job));
}

module.exports = { stats, students, recruiters, jobs, moderateJob };