import StatCard from '../../components/common/StatCard.jsx';

export default function DashboardStats({ stats = [], loading }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} loading={loading} />
      ))}
    </div>
  );
}
