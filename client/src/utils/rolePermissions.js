import { ROLES } from '../constants/roles.js';

// Central helper so route guards and UI both agree on who can see what.
export function hasRole(user, ...allowedRoles) {
  if (!user || !user.role) return false;
  if (!allowedRoles.length) return true;
  return allowedRoles.flat().includes(user.role);
}

export function isStudent(user) { return hasRole(user, ROLES.STUDENT); }
export function isRecruiter(user) { return hasRole(user, ROLES.RECRUITER); }
export function isAdmin(user) { return hasRole(user, ROLES.ADMIN); }
