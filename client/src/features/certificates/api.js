import httpClient from '../../services/httpClient.js';

const unwrap = (response) => response.data.data;

export const getDashboardStats = () => httpClient.get('/admin/stats').then(unwrap);
export const getStudents = () => httpClient.get('/admin/students').then(unwrap);
export const getMyCertificates = () => httpClient.get('/certificates/mine').then(unwrap);
export const createCertificate = (payload) => httpClient.post('/certificates', payload).then(unwrap);
export const getPendingCertificates = () => httpClient.get('/certificates/pending').then(unwrap);
export const getCertificate = (id) => httpClient.get(`/certificates/${encodeURIComponent(id)}`).then(unwrap);
export const reviewCertificate = (id, data) => httpClient.patch(`/certificates/${encodeURIComponent(id)}/review`, data).then(unwrap);
export const publicVerification = (id) => httpClient.get(`/verify/${encodeURIComponent(id)}`).then(unwrap);
