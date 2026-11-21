const mongoose = require('mongoose');
const Skill = require('../models/Skill.model');
const { success, failure } = require('../utils/apiResponse');

const levels = ['beginner', 'intermediate', 'advanced'];

async function list(request, response) {
  const skills = await Skill.find({ student: request.auth.sub }).sort({ name: 1 }).lean();
  return response.json(success(skills));
}

async function create(request, response) {
  const { name, category = '', level = 'intermediate' } = request.body || {};
  if (typeof name !== 'string' || !name.trim() || !levels.includes(String(level).toLowerCase())) {
    return response.status(400).json(failure('INVALID_SKILL', 'A skill name and valid proficiency level are required.'));
  }
  try {
    const skill = await Skill.create({ student: request.auth.sub, name: name.trim(), category, level: String(level).toLowerCase() });
    return response.status(201).json(success(skill));
  } catch (error) {
    if (error.code === 11000) return response.status(409).json(failure('SKILL_EXISTS', 'This skill is already in your profile.'));
    throw error;
  }
}

async function remove(request, response) {
  if (!mongoose.isValidObjectId(request.params.id)) return response.status(404).json(failure('SKILL_NOT_FOUND', 'Skill not found.'));
  const skill = await Skill.findOneAndDelete({ _id: request.params.id, student: request.auth.sub });
  if (!skill) return response.status(404).json(failure('SKILL_NOT_FOUND', 'Skill not found.'));
  return response.json(success({ deleted: true }));
}

module.exports = { list, create, remove };