const mongoose = require('mongoose');
const Job = require('../models/Job.model');
const Application = require('../models/Application.model');
const { success, failure } = require('../utils/apiResponse');

function validId(id) {
  return mongoose.isValidObjectId(id);
}

async function list(request, response) {
  const query = { status: 'open', $or: [{ applicationDeadline: null }, { applicationDeadline: { $gte: new Date() } }] };
  if (request.query.search) {
    const term = String(request.query.search).trim().slice(0, 100);
    query.$and = [{ $or: [
      { title: { $regex: term, $options: 'i' } },
      { companyName: { $regex: term, $options: 'i' } },
      { location: { $regex: term, $options: 'i' } },
    ] }];
  }
  if (request.query.location) query.location = { $regex: String(request.query.location).trim().slice(0, 80), $options: 'i' };
  if (['full-time', 'part-time', 'internship', 'contract'].includes(request.query.jobType)) {
    query.jobType = request.query.jobType;
  }
  if (request.query.skills) {
    const skills = String(request.query.skills).split(',').map((skill) => skill.trim()).filter(Boolean).slice(0, 20);
    if (skills.length) query.requiredSkills = { $in: skills.map((skill) => new RegExp(`^${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i')) };
  }
  const limit = Math.min(Math.max(Number.parseInt(request.query.limit, 10) || 50, 1), 100);
  const jobs = await Job.find(query).sort({ createdAt: -1 }).limit(limit).lean();
  return response.json(success(jobs));
}

async function mine(request, response) {
  const jobs = await Job.find({ recruiter: request.auth.sub }).sort({ createdAt: -1 }).lean();
  return response.json(success(jobs));
}

async function get(request, response) {
  if (!validId(request.params.id)) return response.status(404).json(failure('JOB_NOT_FOUND', 'Job not found.'));
  const job = await Job.findById(request.params.id).lean();
  if (!job) return response.status(404).json(failure('JOB_NOT_FOUND', 'Job not found.'));
  return response.json(success(job));
}

async function create(request, response) {
  const { title, companyName, location, description, requiredSkills, applicationDeadline, eligibilityCriteria, jobType, salaryRange } = request.body || {};
  if (!title || !companyName || !location || !Array.isArray(requiredSkills) || !requiredSkills.length || !applicationDeadline || Number.isNaN(Date.parse(applicationDeadline))) {
    return response.status(400).json(failure('INVALID_JOB', 'Title, company, location, required skills, and a valid application deadline are required.'));
  }
  const job = await Job.create({
    recruiter: request.auth.sub,
    title,
    companyName,
    location,
    description: description || '',
    eligibilityCriteria: eligibilityCriteria || '',
    requiredSkills: requiredSkills.map((skill) => String(skill).trim()).filter(Boolean),
    applicationDeadline: new Date(applicationDeadline),
    jobType,
    salaryRange,
  });
  return response.status(201).json(success(job));
}

async function update(request, response) {
  if (!validId(request.params.id)) return response.status(404).json(failure('JOB_NOT_FOUND', 'Job not found.'));
  const job = await Job.findById(request.params.id);
  if (!job) return response.status(404).json(failure('JOB_NOT_FOUND', 'Job not found.'));
  if (String(job.recruiter) !== request.auth.sub) return response.status(403).json(failure('FORBIDDEN', 'You can only edit your own jobs.'));
  const allowed = ['title', 'companyName', 'location', 'description', 'requiredSkills', 'applicationDeadline', 'eligibilityCriteria', 'jobType', 'salaryRange'];
  for (const key of allowed) {
    if (request.body?.[key] !== undefined) job[key] = request.body[key];
  }
  await job.save();
  return response.json(success(job));
}

async function close(request, response) {
  if (!validId(request.params.id)) return response.status(404).json(failure('JOB_NOT_FOUND', 'Job not found.'));
  const job = await Job.findById(request.params.id);
  if (!job) return response.status(404).json(failure('JOB_NOT_FOUND', 'Job not found.'));
  if (String(job.recruiter) !== request.auth.sub) return response.status(403).json(failure('FORBIDDEN', 'You can only close your own jobs.'));
  job.status = 'closed';
  await job.save();
  return response.json(success(job));
}

async function remove(request, response) {
  if (!validId(request.params.id)) return response.status(404).json(failure('JOB_NOT_FOUND', 'Job not found.'));
  const job = await Job.findById(request.params.id);
  if (!job) return response.status(404).json(failure('JOB_NOT_FOUND', 'Job not found.'));
  if (String(job.recruiter) !== request.auth.sub) return response.status(403).json(failure('FORBIDDEN', 'You can only delete your own jobs.'));
  const applications = await Application.exists({ job: job._id });
  if (applications) return response.status(409).json(failure('JOB_HAS_APPLICATIONS', 'Close this job instead of deleting it because it has applications.'));
  await job.deleteOne();
  return response.json(success({ deleted: true }));
}

module.exports = { list, mine, get, create, update, close, remove };