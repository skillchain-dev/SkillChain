import { SkeletonCard } from '../ui/Skeleton.jsx';

export default function StatCard({ label, value, hint, trend, loading }) {
  if (loading) return <SkeletonCard />;
  return (
    <div className="rounded-card border border-mist-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-mist-600">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-forest-700">{value}</p>
      {(hint || trend) && (
        <p className="mt-1.5 text-xs text-mist-600">
          {trend && <span className={trend.direction === 'down' ? 'text-danger-600' : 'text-success-600'}>{trend.value} </span>}
          {hint}
        </p>
      )}
    </div>
  );
}
