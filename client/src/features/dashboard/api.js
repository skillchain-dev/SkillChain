import { jobsApi } from '../jobs/api.js';
import { applicationsApi } from '../applications/api.js';

// Composes existing feature APIs into the small summaries the dashboard home pages need,
// rather than depending on a dedicated /dashboard endpoint that doesn't exist yet.
export const dashboardApi = {
  studentSummary: async () => {
    const [applicationsRes, jobsRes] = await Promise.all([
      applicationsApi.mine(),
      jobsApi.list({ limit: 4 }),
    ]);
    return { applications: applicationsRes.data?.data ?? [], recommendedJobs: jobsRes.data?.data ?? [] };
  },
  recruiterSummary: async () => {
    const jobsRes = await jobsApi.mine();
    return { jobs: jobsRes.data?.data ?? [] };
  },
};
