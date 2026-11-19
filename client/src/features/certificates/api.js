import { api } from '../../services/httpClient.js';
export const getDashboardStats = () => api('/admin/stats');
export const getStudents = () => api('/admin/students');
export const getPendingCertificates = () => api('/certificates/pending');
export const getCertificate = (id) => api(`/certificates/${encodeURIComponent(id)}`);
export const reviewCertificate = (id, data) => api(`/certificates/${encodeURIComponent(id)}/review`, { method: 'PATCH', body: JSON.stringify(data) });
export const publicVerification = (id) => api(`/verify/${encodeURIComponent(id)}`);
