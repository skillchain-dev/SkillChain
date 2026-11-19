export const APPLICATION_STATUS = {
  APPLIED: 'applied',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
  HIRED: 'hired',
};

export const APPLICATION_STATUS_LABEL = {
  [APPLICATION_STATUS.APPLIED]: 'Applied',
  [APPLICATION_STATUS.SHORTLISTED]: 'Shortlisted',
  [APPLICATION_STATUS.REJECTED]: 'Rejected',
  [APPLICATION_STATUS.HIRED]: 'Hired',
};

// Tailwind class pairs (background/text) keyed by status, used by StatusBadge.
export const APPLICATION_STATUS_TONE = {
  [APPLICATION_STATUS.APPLIED]: 'bg-amber-50 text-amber-500',
  [APPLICATION_STATUS.SHORTLISTED]: 'bg-success-50 text-success-600',
  [APPLICATION_STATUS.REJECTED]: 'bg-danger-50 text-danger-600',
  [APPLICATION_STATUS.HIRED]: 'bg-forest-100 text-forest-600',
};
