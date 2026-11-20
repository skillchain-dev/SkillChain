import httpClient from '../../services/httpClient.js';

const JOBS_KEY = 'skillchain_mock_jobs';
const seedJobs = [
  { _id: 'demo-job-1', title: 'Frontend Developer Intern', companyName: 'Northstar Labs', location: 'Bangalore', jobType: 'internship', requiredSkills: ['React', 'JavaScript', 'CSS'], description: 'Build polished web experiences with the frontend team.', eligibilityCriteria: 'Students in Computer Science or related disciplines.', applicationDeadline: '2027-06-30', status: 'open' },
];

function readJobs() {
  try { return JSON.parse(localStorage.getItem(JOBS_KEY)) || seedJobs; } catch { return seedJobs; }
}
function writeJobs(jobs) { localStorage.setItem(JOBS_KEY, JSON.stringify(jobs)); }
function response(data) { return Promise.resolve({ data: { data } }); }

const realJobsApi = { list: (params) => httpClient.get('/jobs', { params }), get: (id) => httpClient.get(`/jobs/${id}`), mine: () => httpClient.get('/jobs/mine'), create: (payload) => httpClient.post('/jobs', payload), update: (id, payload) => httpClient.patch(`/jobs/${id}`, payload), close: (id) => httpClient.patch(`/jobs/${id}/close`), remove: (id) => httpClient.delete(`/jobs/${id}`) };

const mockJobsApi = {
  list: (params = {}) => {
    let jobs = readJobs();
    if (params.search) jobs = jobs.filter((job) => `${job.title} ${job.companyName}`.toLowerCase().includes(params.search.toLowerCase()));
    if (params.location) jobs = jobs.filter((job) => job.location?.toLowerCase().includes(params.location.toLowerCase()));
    if (params.jobType) jobs = jobs.filter((job) => job.jobType === params.jobType);
    if (params.skills) jobs = jobs.filter((job) => params.skills.split(',').some((skill) => job.requiredSkills.join(' ').toLowerCase().includes(skill.trim().toLowerCase())));
    return response(jobs);
  },
  get: (id) => response(readJobs().find((job) => job._id === id) || null),
  mine: () => response(readJobs()),
  create: (payload) => { const job = { ...payload, _id: `job-${Date.now()}`, status: 'open' }; writeJobs([...readJobs(), job]); return response(job); },
  update: (id, payload) => { const jobs = readJobs().map((job) => job._id === id ? { ...job, ...payload } : job); writeJobs(jobs); return response(jobs.find((job) => job._id === id)); },
  close: (id) => { const jobs = readJobs().map((job) => job._id === id ? { ...job, status: 'closed' } : job); writeJobs(jobs); return response(jobs.find((job) => job._id === id)); },
  remove: (id) => { writeJobs(readJobs().filter((job) => job._id !== id)); return response({ deleted: true }); },
};

export const jobsApi = import.meta.env.VITE_MOCK_AUTH === 'true' ? mockJobsApi : realJobsApi;
