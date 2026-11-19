import EmptyState from '../ui/EmptyState.jsx';
import { SkeletonText } from '../ui/Skeleton.jsx';

// columns: [{ key, header, render?(row) }]
export default function DataTable({ columns, rows = [], loading, emptyTitle = 'Nothing here yet', emptyDescription, rowKey = '_id' }) {
  if (loading) {
    return (
      <div className="rounded-card border border-mist-200 bg-white p-6">
        <SkeletonText lines={5} />
      </div>
    );
  }

  if (!rows.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-x-auto rounded-card border border-mist-200 bg-white">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="border-b border-mist-200 px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-mist-600">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[rowKey] ?? JSON.stringify(row)} className="hover:bg-mist-100/50">
              {columns.map((column) => (
                <td key={column.key} className="border-b border-mist-100 px-5 py-4 text-ink">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
