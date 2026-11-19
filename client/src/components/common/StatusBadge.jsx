import Badge from '../ui/Badge.jsx';
import { APPLICATION_STATUS_LABEL, APPLICATION_STATUS_TONE } from '../../constants/applicationStatus.js';

const GENERIC_TONE = {
  open: 'success', active: 'success', approved: 'success', verified: 'success', hired: 'success',
  pending: 'amber', applied: 'amber', 'in-review': 'amber',
  closed: 'neutral', rejected: 'danger', revoked: 'danger', shortlisted: 'forest',
};

export default function StatusBadge({ status, className = '' }) {
  if (!status) return null;
  const normalized = String(status).toLowerCase();
  const label = APPLICATION_STATUS_LABEL[normalized] || status.replace(/[-_]/g, ' ');
  const tone = APPLICATION_STATUS_TONE[normalized] ? null : (GENERIC_TONE[normalized] || 'neutral');

  if (APPLICATION_STATUS_TONE[normalized]) {
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${APPLICATION_STATUS_TONE[normalized]} ${className}`}>
        {label}
      </span>
    );
  }
  return <Badge tone={tone} className={`capitalize ${className}`}>{label}</Badge>;
}
