const { mongoUri } = require('../src/config/env');
const { connectDatabase, disconnectDatabase } = require('../src/config/db');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User.model');
const StudentProfile = require('../src/models/StudentProfile.model');
const RecruiterProfile = require('../src/models/RecruiterProfile.model');
const Skill = require('../src/models/Skill.model');
const Job = require('../src/models/Job.model');
const Project = require('../src/models/Project.model');
const Certificate = require('../src/models/Certificate.model');
const sampleStudents = require('../../database/seed/students.seed');
const sampleJobs = require('../../database/seed/jobs.seed');
const sampleCertificates = require('../../database/seed/certificates.seed');

async function seed() {
  await connectDatabase(mongoUri);

  if (process.argv.includes('--reset')) {
    await Promise.all([
      User.deleteMany({}),
      StudentProfile.deleteMany({}),
      RecruiterProfile.deleteMany({}),
      Skill.deleteMany({}),
      Job.deleteMany({}),
      Project.deleteMany({}),
      Certificate.deleteMany({}),
    ]);
  }

  const seededStudents = [];

  for (const sample of sampleStudents) {
    const password = await bcrypt.hash(sample.password, 12);
    const user = await User.findOneAndUpdate(
      { email: sample.email },
      { name: sample.name, password, role: 'student' },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    seededStudents.push(user);

    await StudentProfile.findOneAndUpdate(
      { user: user._id },
      {
        college: sample.profile.college,
        branch: sample.profile.branch,
        graduationYear: sample.profile.graduationYear,
        phone: sample.profile.phone,
        bio: sample.profile.bio,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    for (const skill of sample.profile.skills) {
      await Skill.findOneAndUpdate(
        { student: user._id, name: skill.name },
        skill,
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }
  }

  // Seed sample projects for students
  if (seededStudents.length >= 2) {
    await Project.findOneAndUpdate(
      { student: seededStudents[0]._id, title: 'SkillChain Verification DApp' },
      {
        student: seededStudents[0]._id,
        title: 'SkillChain Verification DApp',
        description: 'Decentralized verifiable credential registry built with React, Hardhat, Solidity, and Node.js.',
        technologies: ['React', 'Solidity', 'Node.js', 'Ethers.js'],
        githubLink: 'https://github.com/skillchain-dev/SkillChain',
        liveDemoLink: 'http://localhost:5173',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await Project.findOneAndUpdate(
      { student: seededStudents[1]._id, title: 'Cloud Observability & Deployment Engine' },
      {
        student: seededStudents[1]._id,
        title: 'Cloud Observability & Deployment Engine',
        description: 'Automated CI/CD pipeline and multi-service deployment orchestrator using Docker and Express.',
        technologies: ['Docker', 'Node.js', 'Express', 'MongoDB'],
        githubLink: 'https://github.com/skillchain-dev/pipeline',
        liveDemoLink: '',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const recruiterPassword = await bcrypt.hash('Password@123', 12);
  const recruiter = await User.findOneAndUpdate(
    { email: 'recruiter@skillchain.edu' },
    { name: 'SkillChain Recruiter', password: recruiterPassword, role: 'recruiter' },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  await RecruiterProfile.findOneAndUpdate(
    { user: recruiter._id },
    { companyName: 'SkillChain Careers', position: 'Talent Acquisition' },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  // Seed faculty admin
  const adminPassword = await bcrypt.hash('Password@123', 12);
  await User.findOneAndUpdate(
    { email: 'admin@skillchain.edu' },
    { name: 'SkillChain Faculty Admin', password: adminPassword, role: 'admin' },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  for (const job of sampleJobs) {
    await Job.findOneAndUpdate(
      { title: job.title, companyName: job.companyName },
      { ...job, recruiter: recruiter._id },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  // Seed certificates and link to students: first approved, second pending for admin review
  for (let i = 0; i < sampleCertificates.length; i++) {
    const cert = sampleCertificates[i];
    const assignedStudent = seededStudents[i % seededStudents.length];
    const status = i === 1 ? 'pending' : (cert.status || 'approved');
    await Certificate.findOneAndUpdate(
      { certificateId: cert.certificateId },
      {
        ...cert,
        status,
        student: assignedStudent?._id,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  const counts = {
    users: await User.countDocuments(),
    students: await User.countDocuments({ role: 'student' }),
    studentProfiles: await StudentProfile.countDocuments(),
    recruiters: await User.countDocuments({ role: 'recruiter' }),
    admins: await User.countDocuments({ role: 'admin' }),
    skills: await Skill.countDocuments(),
    projects: await Project.countDocuments(),
    jobs: await Job.countDocuments(),
    certificates: await Certificate.countDocuments(),
    pendingCertificates: await Certificate.countDocuments({ status: 'pending' }),
  };

  console.log(JSON.stringify(counts));
}

seed()
  .catch((error) => {
    console.error(`Seed failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });
