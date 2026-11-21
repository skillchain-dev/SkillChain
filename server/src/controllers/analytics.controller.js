const Application = require('../models/Application.model');
const Certificate = require('../models/Certificate.model');
const Job = require('../models/Job.model');
const Project = require('../models/Project.model');
const Skill = require('../models/Skill.model');
const User = require('../models/User.model');
const { success, failure } = require('../utils/apiResponse');

async function summary(request, response) {
  const { role } = request.params;
  if (!['student', 'recruiter', 'admin'].includes(role)) {
    return response.status(400).json(failure('INVALID_ANALYTICS_ROLE', 'role must be student, recruiter, or admin'));
  }
  if (request.user.role !== role) {
    return response.status(403).json(failure('FORBIDDEN', 'You can only view analytics for your own role.'));
  }

  const userId = request.user._id;
  let stats;
  let series = [];
  if (role === 'student') {
    const [applications, projects, skills, certificates] = await Promise.all([
      Application.find({ student: userId }).select('status appliedAt').lean(),
      Project.countDocuments({ student: userId }),
      Skill.countDocuments({ student: userId }),
      Certificate.countDocuments({ student: userId, status: 'approved' }),
    ]);
    const statusCounts = applications.reduce((counts, application) => {
      counts[application.status] = (counts[application.status] || 0) + 1;
      return counts;
    }, {});
    stats = [
      { label: 'Applications', value: applications.length },
      { label: 'Projects', value: projects },
      { label: 'Skills', value: skills },
      { label: 'Verified certificates', value: certificates },
    ];
    series = Object.entries(statusCounts).map(([label, value]) => ({ label, value }));
  } else if (role === 'recruiter') {
    const jobs = await Job.find({ recruiter: userId }).select('_id status createdAt').lean();
    const jobIds = jobs.map((job) => job._id);
    const [totalApplications, shortlisted, hired] = await Promise.all([
      Application.countDocuments({ job: { $in: jobIds } }),
      Application.countDocuments({ job: { $in: jobIds }, status: 'shortlisted' }),
      Application.countDocuments({ job: { $in: jobIds }, status: 'hired' }),
    ]);
    stats = [
      { label: 'Open jobs', value: jobs.filter((job) => job.status === 'open').length },
      { label: 'Total jobs', value: jobs.length },
      { label: 'Applications', value: totalApplications },
      { label: 'Shortlisted', value: shortlisted },
      { label: 'Hired', value: hired },
    ];
    series = jobs.map((job) => ({
      label: job.createdAt ? new Date(job.createdAt).toISOString().slice(0, 10) : 'Recent',
      value: job.status === 'open' ? 1 : 0,
    }));
  } else {
    const [students, recruiters, jobs, applications, pendingCertificates, approvedCertificates] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'recruiter' }),
      Job.countDocuments(),
      Application.countDocuments(),
      Certificate.countDocuments({ status: 'pending' }),
      Certificate.countDocuments({ status: 'approved' }),
    ]);
    stats = [
      { label: 'Students', value: students },
      { label: 'Recruiters', value: recruiters },
      { label: 'Jobs', value: jobs },
      { label: 'Applications', value: applications },
      { label: 'Pending certificates', value: pendingCertificates },
      { label: 'Approved certificates', value: approvedCertificates },
    ];
  }
  return response.json(success({ role, stats, series, generatedAt: new Date().toISOString() }));
}

module.exports = { summary };
