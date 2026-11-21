import { useEffect, useState } from 'react';
import { analyticsApi } from './api.js';

export default function RoleAnalytics({ role }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    analyticsApi.summary(role)
      .then((response) => { if (active) setData(response.data.data); })
      .catch((requestError) => { if (active) setError(requestError.message || 'Could not load analytics.'); });
    return () => { active = false; };
  }, [role]);

  if (error) return <p role="alert" className="error">{error}</p>;
  if (!data) return <p className="muted">Loading analytics…</p>;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.stats.map((stat) => (
          <article key={stat.label} className="rounded-card border border-mist-200 bg-white p-5">
            <p className="eyebrow">{stat.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold text-forest-700">{stat.value}</p>
          </article>
        ))}
      </div>
      {data.series.length > 0 && (
        <section className="rounded-card border border-mist-200 bg-white p-5">
          <h2 className="font-display text-lg font-semibold">Activity breakdown</h2>
          <ul className="mt-3 space-y-2">
            {data.series.map((point, index) => (
              <li key={`${point.label}-${index}`} className="flex justify-between gap-4 border-b border-mist-100 py-2">
                <span>{point.label}</span><strong>{point.value}</strong>
              </li>
            ))}
          </ul>
        </section>
      )}
      <p className="text-xs text-mist-500">Generated {new Date(data.generatedAt).toLocaleString()}</p>
    </div>
  );
}
