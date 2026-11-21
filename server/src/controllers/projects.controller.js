const mongoose = require('mongoose');
const Project = require('../models/Project.model');
const { success, failure } = require('../utils/apiResponse');

async function list(request, response) {
  const projects = await Project.find({ student: request.auth.sub }).sort({ createdAt: -1 }).lean();
  return response.json(success(projects));
}

async function create(request, response) {
  const { title, description = '', technologies = [], githubLink = '', liveDemoLink = '' } = request.body || {};
  if (typeof title !== 'string' || !title.trim() || !Array.isArray(technologies)) {
    return response.status(400).json(failure('INVALID_PROJECT', 'A title and a technologies array are required.'));
  }
  const project = await Project.create({ student: request.auth.sub, title: title.trim(), description, technologies, githubLink, liveDemoLink });
  return response.status(201).json(success(project));
}

async function update(request, response) {
  if (!mongoose.isValidObjectId(request.params.id)) return response.status(404).json(failure('PROJECT_NOT_FOUND', 'Project not found.'));
  const project = await Project.findOne({ _id: request.params.id, student: request.auth.sub });
  if (!project) return response.status(404).json(failure('PROJECT_NOT_FOUND', 'Project not found.'));
  for (const key of ['title', 'description', 'technologies', 'githubLink', 'liveDemoLink']) {
    if (request.body?.[key] !== undefined) project[key] = request.body[key];
  }
  await project.save();
  return response.json(success(project));
}

async function remove(request, response) {
  if (!mongoose.isValidObjectId(request.params.id)) return response.status(404).json(failure('PROJECT_NOT_FOUND', 'Project not found.'));
  const project = await Project.findOneAndDelete({ _id: request.params.id, student: request.auth.sub });
  if (!project) return response.status(404).json(failure('PROJECT_NOT_FOUND', 'Project not found.'));
  return response.json(success({ deleted: true }));
}

module.exports = { list, create, update, remove };