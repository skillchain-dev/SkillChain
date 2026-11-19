const { mongoUri } = require('../src/config/env');
const { connectDatabase, disconnectDatabase } = require('../src/config/db');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User.model');
const StudentProfile = require('../src/models/StudentProfile.model');
const RecruiterProfile = require('../src/models/RecruiterProfile.model');
const Skill = require('../src/models/Skill.model');
const Job = require('../src/models/Job.model');
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
      Certificate.deleteMany({}),
    ]);
  }

  for (const sample of sampleStudents) {
    const password = await bcrypt.hash(sample.password, 12);
    const user = await User.findOneAndUpdate(
      { email: sample.email },
      { name: sample.name, password, role: 'student' },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

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

  for (const job of sampleJobs) {
    await Job.findOneAndUpdate(
      { title: job.title, companyName: job.companyName },
      { ...job, recruiter: recruiter._id },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  for (const certificate of sampleCertificates) {
    await Certificate.findOneAndUpdate(
      { certificateId: certificate.certificateId },
      certificate,
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  const counts = {
    users: await User.countDocuments(),
    studentProfiles: await StudentProfile.countDocuments(),
    recruiters: await User.countDocuments({ role: 'recruiter' }),
    skills: await Skill.countDocuments(),
    jobs: await Job.countDocuments(),
    certificates: await Certificate.countDocuments(),
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
