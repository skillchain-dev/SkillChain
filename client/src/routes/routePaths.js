// Central path constants — import these instead of hardcoding strings so a path
// only ever needs to change in one place.
export const PATHS = {
  HOME: '/',
  ABOUT: '/about',
  EXPLORE_TALENT: '/explore-talent',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY: '/verify',
  VERIFY_DETAIL: '/verify/:certificateId',
  NOT_FOUND: '/404',

  STUDENT_HOME: '/student',
  RECRUITER_HOME: '/recruiter',
  ADMIN_HOME: '/admin',

  JOBS: '/jobs',
  JOB_DETAILS: '/jobs/:id',
  APPLICATIONS: '/applications',
};
