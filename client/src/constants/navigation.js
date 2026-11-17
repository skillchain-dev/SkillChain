import { ROLES } from './roles.js';

// Public, unauthenticated navigation shown on marketing pages.
export const PUBLIC_NAV = [
  { to: '/', label: 'Home' },
  { to: '/explore-talent', label: 'Explore talent' },
  { to: '/about', label: 'About' },
];

// Sidebar navigation per role for the authenticated dashboard shell.
export const ROLE_NAV = {
  [ROLES.STUDENT]: [
    { to: '/student', label: 'Overview', icon: 'grid', end: true },
    { to: '/jobs', label: 'Find jobs', icon: 'search' },
    { to: '/applications', label: 'My applications', icon: 'inbox' },
    { to: '/student/skills', label: 'Skills', icon: 'sparkles' },
    { to: '/student/projects', label: 'Projects', icon: 'folder' },
    { to: '/student/certificates', label: 'Certificates', icon: 'shield' },
    { to: '/student/resume', label: 'Resume', icon: 'file' },
    { to: '/student/analytics', label: 'Analytics', icon: 'chart' },
    { to: '/student/profile', label: 'Profile', icon: 'user' },
  ],
  [ROLES.RECRUITER]: [
    { to: '/recruiter', label: 'Overview', icon: 'grid', end: true },
    { to: '/recruiter/jobs', label: 'My job posts', icon: 'briefcase' },
    { to: '/recruiter/jobs/new', label: 'Post a job', icon: 'plus' },
    { to: '/recruiter/candidates', label: 'Candidates', icon: 'users' },
    { to: '/recruiter/analytics', label: 'Analytics', icon: 'chart' },
    { to: '/recruiter/company', label: 'Company profile', icon: 'building' },
  ],
  [ROLES.ADMIN]: [
    { to: '/admin', label: 'Overview', icon: 'grid', end: true },
    { to: '/admin/certificates', label: 'Certificate approvals', icon: 'shield' },
    { to: '/admin/students', label: 'Students', icon: 'users' },
    { to: '/admin/recruiters', label: 'Recruiters', icon: 'building' },
    { to: '/admin/jobs', label: 'Job moderation', icon: 'briefcase' },
    { to: '/admin/analytics', label: 'Analytics', icon: 'chart' },
  ],
};
