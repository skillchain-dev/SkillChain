const Certificate = require('../models/Certificate.model');
const User = require('../models/User.model');
const StudentProfile = require('../models/StudentProfile.model');
const Skill = require('../models/Skill.model');
const Project = require('../models/Project.model');
const { success, failure } = require('../utils/apiResponse');
const { verifyCredential } = require('../services/blockchain.service');

async function verify(request, response) {
  const certificate = await Certificate.findOne({
    certificateId: request.params.certificateId,
    status: 'approved',
  }).select('certificateId title issuer issueDate fileUrl certificateHash chainTxHash chainCredentialId student').populate('student', 'name email').lean();
  if (!certificate) return response.status(404).json(failure('CERTIFICATE_NOT_FOUND', 'No approved credential matches that identifier.'));
  const chainProof = await verifyCredential(certificate.chainCredentialId, certificate.certificateHash);
  return response.json(success({
    status: chainProof.verified ? 'Verified' : 'Unverified',
    certificate,
    blockchain: chainProof,
  }));
}

async function directory(request, response) {
  const students = await User.find({ role: 'student' }).select('name email avatarUrl createdAt').lean();
  const ids = students.map((s) => s._id);
  const [profiles, skills, certificates, projects] = await Promise.all([
    StudentProfile.find({ user: { $in: ids } }).lean(),
    Skill.find({ student: { $in: ids } }).lean(),
    Certificate.find({ student: { $in: ids }, status: 'approved' }).select('certificateId title issuer status').lean(),
    Project.find({ student: { $in: ids } }).select('title description technologies githubLink liveDemoLink').lean(),
  ]);

  const profileByUser = new Map(profiles.map((p) => [String(p.user), p]));
  const skillsByUser = new Map();
  for (const skill of skills) {
    const k = String(skill.student);
    if (!skillsByUser.has(k)) skillsByUser.set(k, []);
    skillsByUser.get(k).push({ name: skill.name, category: skill.category, level: skill.level, verified: skill.verified });
  }
  const certsByUser = new Map();
  for (const cert of certificates) {
    const k = String(cert.student);
    if (!certsByUser.has(k)) certsByUser.set(k, []);
    certsByUser.get(k).push(cert);
  }
  const projectsByUser = new Map();
  for (const project of projects) {
    const k = String(project.student);
    if (!projectsByUser.has(k)) projectsByUser.set(k, []);
    projectsByUser.get(k).push(project);
  }

  const querySearch = (request.query.search || '').toLowerCase().trim();
  const queryBranch = (request.query.branch || '').toLowerCase().trim();
  const querySkill = (request.query.skills || '').toLowerCase().trim();

  const talentList = students.map((student) => {
    const p = profileByUser.get(String(student._id)) || {};
    const s = skillsByUser.get(String(student._id)) || [];
    const c = certsByUser.get(String(student._id)) || [];
    const pr = projectsByUser.get(String(student._id)) || [];
    return {
      _id: student._id,
      name: student.name,
      college: p.college || 'GLA University, Mathura',
      branch: p.branch || 'Computer Science & Engineering',
      graduationYear: p.graduationYear || 2026,
      bio: p.bio || '',
      resumeUrl: p.resumeUrl || '',
      skills: s,
      approvedCertificatesCount: c.length,
      certificates: c,
      projects: pr,
    };
  }).filter((student) => {
    if (querySearch && !student.name.toLowerCase().includes(querySearch) && !student.college.toLowerCase().includes(querySearch)) {
      return false;
    }
    if (queryBranch && !student.branch.toLowerCase().includes(queryBranch)) {
      return false;
    }
    if (querySkill && !student.skills.some((sk) => sk.name.toLowerCase().includes(querySkill))) {
      return false;
    }
    return true;
  });

  return response.json(success(talentList));
}

module.exports = { verify, directory };
