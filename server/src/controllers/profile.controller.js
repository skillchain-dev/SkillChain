const StudentProfile = require('../models/StudentProfile.model');
const RecruiterProfile = require('../models/RecruiterProfile.model');
const { success, failure } = require('../utils/apiResponse');

const studentFields = ['college', 'branch', 'graduationYear', 'phone', 'bio', 'resumeUrl'];
const recruiterFields = ['companyName', 'position', 'website', 'bio'];

async function getMine(request, response) {
  const Model = request.user.role === 'student' ? StudentProfile : RecruiterProfile;
  const profile = await Model.findOne({ user: request.user._id }).lean();
  return response.json(success(profile || { user: request.user._id }));
}

async function updateMine(request, response) {
  const isStudent = request.user.role === 'student';
  const Model = isStudent ? StudentProfile : RecruiterProfile;
  const fields = isStudent ? studentFields : recruiterFields;
  const update = {};
  for (const field of fields) {
    if (request.body?.[field] !== undefined) update[field] = request.body[field];
  }
  if (isStudent && update.graduationYear !== undefined) {
    if (update.graduationYear === '') {
      delete update.graduationYear;
    } else {
      update.graduationYear = Number(update.graduationYear);
    }
    if (update.graduationYear !== undefined && (!Number.isInteger(update.graduationYear) || update.graduationYear < 1900 || update.graduationYear > 2200)) {
      return response.status(400).json(failure('INVALID_GRADUATION_YEAR', 'Graduation year is invalid.'));
    }
  }
  const profile = await Model.findOneAndUpdate(
    { user: request.user._id },
    { $set: update, $setOnInsert: { user: request.user._id } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  return response.json(success(profile));
}

module.exports = { getMine, updateMine };