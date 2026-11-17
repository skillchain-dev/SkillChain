const TONES = {
  neutral: 'bg-mist-100 text-mist-700',
  forest: 'bg-forest-100 text-forest-600',
  clay: 'bg-clay-50 text-clay-600',
  success: 'bg-success-50 text-success-600',
  danger: 'bg-danger-50 text-danger-600',
  amber: 'bg-amber-50 text-amber-500',
};

export default function Badge({ tone = 'neutral', className = '', children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${TONES[tone] || TONES.neutral} ${className}`}>
      {children}
    </span>
  );
}
