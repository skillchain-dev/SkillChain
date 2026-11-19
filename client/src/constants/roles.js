export const ROLES = {
  STUDENT: 'student',
  RECRUITER: 'recruiter',
  ADMIN: 'admin',
};

export const ROLE_LABELS = {
  [ROLES.STUDENT]: 'Student',
  [ROLES.RECRUITER]: 'Recruiter',
  [ROLES.ADMIN]: 'Admin / Faculty',
};

// Roles a person can pick during public self-registration.
// Admin/Faculty accounts are provisioned by the institution, not self-registered.
export const REGISTERABLE_ROLES = [ROLES.STUDENT, ROLES.RECRUITER];

export const DASHBOARD_HOME = {
  [ROLES.STUDENT]: '/student',
  [ROLES.RECRUITER]: '/recruiter',
  [ROLES.ADMIN]: '/admin',
};
