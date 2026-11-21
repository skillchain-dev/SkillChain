const mongoose = require('mongoose');
const Application = require('../models/Application.model');
const Job = require('../models/Job.model');
const Skill = require('../models/Skill.model');
const StudentProfile = require('../models/StudentProfile.model');
const { calculateJobMatch } = require('../services/jobMatching.service');
const { success, failure } = require('../utils/apiResponse');

async function apply(request, response) {
  if (!mongoose.isValidObjectId(request.params.jobId)) return response.status(404).json(failure('JOB_NOT_FOUND', 'Job not found.'));
  const job = await Job.findOne({ _id: request.params.jobId, status: 'open' });
  if (!job || (job.applicationDeadline && job.applicationDeadline < new Date())) {
    return response.status(404).json(failure('JOB_NOT_AVAILABLE', 'This job is no longer accepting applications.'));
  }
  const skills = await Skill.find({ student: request.auth.sub }).select('name').lean();
  const match = await calculateJobMatch(skills.map((skill) => skill.name), job.requiredSkills);
  try {
    const application = await Application.create({
      job: job._id,
      student: request.auth.sub,
      coverLetter: String(request.body?.coverLetter || '').slice(0, 5000),
      matchScore: match.score,
    });
    return response.status(201).json(success(application));
  } catch (error) {
    if (error.code === 11000) return response.status(409).json(failure('ALREADY_APPLIED', 'You have already applied to this job.'));
    throw error;
  }
}

async function mine(request, response) {
  const applications = await Application.find({ student: request.auth.sub })
    .populate('job', 'title companyName location status')
    .sort({ appliedAt: -1 })
    .lean();
  return response.json(success(applications));
}

async function applicants(request, response) {
  if (!mongoose.isValidObjectId(request.params.jobId)) return response.status(404).json(failure('JOB_NOT_FOUND', 'Job not found.'));
  const job = await Job.findById(request.params.jobId).select('recruiter');
  if (!job) return response.status(404).json(failure('JOB_NOT_FOUND', 'Job not found.'));
  if (String(job.recruiter) !== request.auth.sub) return response.status(403).json(failure('FORBIDDEN', 'You can only view applicants for your own jobs.'));
  const applications = await Application.find({ job: job._id })
    .populate('student', 'name email avatarUrl')
    .sort({ appliedAt: -1 })
    .lean();
  const studentIds = applications.map((application) => application.student?._id).filter(Boolean);
  const profiles = await StudentProfile.find({ user: { $in: studentIds } }).lean();
  const skills = await Skill.find({ student: { $in: studentIds } }).lean();
  const profileByStudent = new Map(profiles.map((profile) => [String(profile.user), profile]));
  const skillsByStudent = new Map();
  for (const skill of skills) {
    const key = String(skill.student);
    if (!skillsByStudent.has(key)) skillsByStudent.set(key, []);
    skillsByStudent.get(key).push({ name: skill.name, verified: skill.verified });
  }
  return response.json(success(applications.map((application) => ({
    ...application,
    profile: {
      ...(profileByStudent.get(String(application.student?._id)) || {}),
      skills: skillsByStudent.get(String(application.student?._id)) || [],
    },
  }))));
}

async function updateStatus(request, response) {
  if (!mongoose.isValidObjectId(request.params.id)) return response.status(404).json(failure('APPLICATION_NOT_FOUND', 'Application not found.'));
  const { status } = request.body || {};
  if (!['shortlisted', 'rejected', 'hired'].includes(status)) {
    return response.status(400).json(failure('INVALID_STATUS', 'Status must be shortlisted, rejected, or hired.'));
  }
  const application = await Application.findById(request.params.id).populate('job', 'recruiter');
  if (!application) return response.status(404).json(failure('APPLICATION_NOT_FOUND', 'Application not found.'));
  if (String(application.job.recruiter) !== request.auth.sub) return response.status(403).json(failure('FORBIDDEN', 'You can only update applicants for your own jobs.'));
  application.status = status;
  await application.save();
  return response.json(success(application));
}

async function candidates(request, response) {
  const query = { role: 'student' };
  const profilesQuery = {};
  if (request.query.branch) profilesQuery.branch = { $regex: String(request.query.branch).slice(0, 80), $options: 'i' };
  if (request.query.graduationYear) profilesQuery.graduationYear = Number(request.query.graduationYear);
  let userIds;
  if (Object.keys(profilesQuery).length) {
    userIds = (await StudentProfile.find(profilesQuery).distinct('user'));
    query._id = { $in: userIds };
  }
  const students = await require('../models/User.model').find(query).select('name email avatarUrl').lean();
  const ids = students.map((student) => student._id);
  const [profiles, skills] = await Promise.all([
    StudentProfile.find({ user: { $in: ids } }).lean(),
    Skill.find({ student: { $in: ids } }).lean(),
  ]);
  const profileByUser = new Map(profiles.map((profile) => [String(profile.user), profile]));
  const skillsByUser = new Map();
  for (const skill of skills) {
    const key = String(skill.student);
    if (!skillsByUser.has(key)) skillsByUser.set(key, []);
    skillsByUser.get(key).push({ name: skill.name, verified: skill.verified });
  }
  const skillFilter = request.query.skills?.toLowerCase();
  const verifiedFilter = request.query.verified;
  const result = students.map((student) => ({
    ...profileByUser.get(String(student._id)),
    user: student,
    skills: skillsByUser.get(String(student._id)) || [],
  })).filter((profile) => {
    if (skillFilter && !profile.skills.some((skill) => skill.name.toLowerCase().includes(skillFilter))) return false;
    if (verifiedFilter === 'true' && !profile.skills.some((skill) => skill.verified)) return false;
    return true;
  });
  return response.json(success(result));
}

module.exports = { apply, mine, applicants, updateStatus, candidates };