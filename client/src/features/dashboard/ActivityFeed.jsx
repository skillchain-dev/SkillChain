import EmptyState from '../../components/ui/EmptyState.jsx';
import { SkeletonText } from '../../components/ui/Skeleton.jsx';
import { timeAgo } from '../../utils/formatDate.js';

export default function ActivityFeed({ items = [], loading, emptyTitle = 'No activity yet' }) {
  if (loading) {
    return (
      <div className="rounded-card border border-mist-200 bg-white p-5">
        <SkeletonText lines={4} />
      </div>
    );
  }

  if (!items.length) {
    return <EmptyState title={emptyTitle} description="Activity will show up here as things happen." />;
  }

  return (
    <ul className="divide-y divide-mist-100 rounded-card border border-mist-200 bg-white">
      {items.map((item, index) => (
        <li key={item.id ?? index} className="flex items-start justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-sm font-medium text-ink">{item.title}</p>
            {item.description && <p className="mt-0.5 text-xs text-mist-600">{item.description}</p>}
          </div>
          {item.timestamp && <span className="shrink-0 text-xs text-mist-500">{timeAgo(item.timestamp)}</span>}
        </li>
      ))}
    </ul>
  );
}
