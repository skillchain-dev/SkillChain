import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import DashboardStats from '../../features/dashboard/DashboardStats.jsx';
import Button from '../../components/ui/Button.jsx';
import { getDashboardStats } from '../../features/certificates/api.js';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err.message || 'Could not load dashboard stats'))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Students', value: stats?.students ?? 0 },
    { label: 'Recruiters', value: stats?.recruiters ?? 0 },
    { label: 'Jobs posted', value: stats?.jobs ?? 0 },
    { label: 'Pending reviews', value: stats?.verification?.pending ?? 0 },
    { label: 'Approved certificates', value: stats?.verification?.approved ?? 0 },
    { label: 'Rejected certificates', value: stats?.verification?.rejected ?? 0 },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader
          eyebrow="Faculty console"
          title="Verification overview"
          description="Keep an eye on students, recruiters, job postings and certificate reviews from one place."
          actions={<Link to="/admin/certificates"><Button>Review queue</Button></Link>}
        />

        {error && (
          <p role="alert" className="rounded border border-danger-500/30 bg-danger-50 px-3.5 py-2.5 text-sm font-medium text-danger-600">
            {error}
          </p>
        )}

        <DashboardStats stats={cards} loading={loading} />

        <section className="rounded-card border border-mist-200 bg-white p-5">
          <h2 className="font-display text-lg font-semibold text-forest-700">Verification activity</h2>
          <p className="mt-2 text-sm leading-relaxed text-mist-600">
            Pending certificates are held off-chain until an authorized administrator approves them. Once
            approved, a certificate is issued a verifiable credential that recruiters can check from its
            public verification link.
          </p>
        </section>
      </div>
    </DashboardLayout>
  );
}
