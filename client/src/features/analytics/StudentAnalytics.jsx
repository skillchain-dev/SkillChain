import { useEffect, useState } from 'react';
import { analyticsApi } from './api.js';

/**
 * StudentAnalytics.jsx
 *
 * Displays a summary analytics panel for the student role.
 * Data comes from GET /api/analytics/student/summary.
 */
export default function StudentAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    analyticsApi
      .summary('student')
      .then(({ data: res }) => setData(res.data))
      .catch(() => setError('Could not load analytics data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="muted">Loading analytics…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      {data?.stats?.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 16,
            marginBottom: 24,
          }}
        >
          {data.stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: '#fff',
                border: '1px solid #e2e9e2',
                borderRadius: 5,
                padding: '18px 20px',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  color: '#809086',
                  fontWeight: 700,
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  margin: '8px 0 0',
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#153d35',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}
      {(!data?.stats || data.stats.length === 0) && (
        <p className="muted" style={{ fontSize: 13 }}>
          No analytics data yet — keep applying to jobs to see trends here.
        </p>
      )}
      <p style={{ fontSize: 11, color: '#afc7ba', marginTop: 8 }}>
        Generated at{' '}
        {data?.generatedAt ? new Date(data.generatedAt).toLocaleString() : '—'}
      </p>
    </div>
  );
}

