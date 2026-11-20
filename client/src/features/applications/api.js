import httpClient from '../../services/httpClient.js';

const APPLICATIONS_KEY = 'skillchain_mock_applications';
function readApplications() { try { return JSON.parse(localStorage.getItem(APPLICATIONS_KEY)) || []; } catch { return []; } }
function writeApplications(items) { localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(items)); }
function response(data) { return Promise.resolve({ data: { data } }); }

const realApplicationsApi = { apply: (jobId, payload) => httpClient.post(`/applications/jobs/${jobId}`, payload), mine: () => httpClient.get('/applications/mine'), applicants: (jobId) => httpClient.get(`/applications/jobs/${jobId}`), updateStatus: (id, status) => httpClient.patch(`/applications/${id}/status`, { status }), candidates: (params) => httpClient.get('/applications/candidates', { params }) };
const mockApplicationsApi = {
  apply: (jobId, payload) => {
    const items = readApplications();
    if (items.some((item) => item.jobId === jobId)) return Promise.reject(new Error('You have already applied to this role.'));
    const application = { _id: `application-${Date.now()}`, jobId, job: { title: 'Frontend Developer Intern', companyName: 'Northstar Labs' }, coverLetter: payload.coverLetter, status: 'applied', createdAt: new Date().toISOString(), matchScore: 75 };
    writeApplications([...items, application]);
    return response(application);
  },
  mine: () => response(readApplications()),
  applicants: (jobId) => response(readApplications().filter((item) => item.jobId === jobId)),
  updateStatus: (id, status) => { const items = readApplications().map((item) => item._id === id ? { ...item, status } : item); writeApplications(items); return response(items.find((item) => item._id === id)); },
  candidates: (params = {}) => {
    try {
      const users = JSON.parse(localStorage.getItem('skillchain_mock_users') || '[]').filter((user) => user.role === 'student');
      let profiles = users.map((user) => ({ _id: `profile-${user._id}`, user: { name: user.name, email: user.email }, branch: '', graduationYear: '', skills: [], resumeUrl: '' }));
      if (params.branch) profiles = profiles.filter((profile) => profile.branch?.toLowerCase().includes(params.branch.toLowerCase()));
      return response(profiles);
    } catch { return response([]); }
  },
};

export const applicationsApi = import.meta.env.VITE_MOCK_AUTH === 'true' ? mockApplicationsApi : realApplicationsApi;
