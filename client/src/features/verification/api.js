import httpClient from '../../services/httpClient.js';

const unwrap = (response) => response.data.data;

export const verificationApi = {
  verify: (certificateId) => httpClient.get(`/verify/${encodeURIComponent(certificateId)}`).then(unwrap),
  directory: (params) => httpClient.get('/verify/directory', { params }).then(unwrap),
};

