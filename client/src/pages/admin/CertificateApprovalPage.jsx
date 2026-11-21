import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import { getPendingCertificates, reviewCertificate } from '../../features/certificates/api.js';

export default function CertificateApprovalPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    getPendingCertificates()
      .then((data) => setItems(data.certificates || []))
      .catch((e) => setError(e.message || 'Could not load review queue.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function decide(id, decision) {
    setProcessingId(id);
    setError('');
    try {
      await reviewCertificate(id, { decision });
      await load();
    } catch (e) {
      setError(e.message || 'Could not process review decision.');
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader
          eyebrow="Admin / Verification Queue"
          title="Review Queue"
          description="Review certificate verification submissions. Approvals issue a verifiable credential on the cryptographic ledger."
          actions={
            <span className="inline-flex items-center rounded-full bg-forest-100 px-3 py-1 text-xs font-semibold text-forest-800">
              {items.length} pending review
            </span>
          }
        />

        {error && (
          <div role="alert" className="rounded-md border border-danger-500/30 bg-danger-50 p-4 text-sm text-danger-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-mist-500 animate-pulse">Loading review queue…</p>
        ) : items.length === 0 ? (
          <div className="rounded-card border border-mist-200 bg-white p-10 text-center">
            <h3 className="font-display text-lg font-semibold text-forest-700">No pending verification requests</h3>
            <p className="mt-1 text-sm text-mist-600">All submitted student certificates have been reviewed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <article
                key={item.certificateId}
                className="rounded-card border border-mist-200 bg-white p-5 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/certificates/${encodeURIComponent(item.certificateId)}`}
                      className="font-display text-lg font-semibold text-forest-800 hover:text-clay-600 transition-colors"
                    >
                      {item.title}
                    </Link>
                    <span className="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
                      Pending
                    </span>
                  </div>
                  <p className="text-xs text-mist-600">
                    Issuer: <span className="font-medium text-ink">{item.issuer}</span> · Student:{' '}
                    <span className="font-medium text-ink">{item.student?.name || 'Student'} ({item.student?.email || 'N/A'})</span>
                  </p>
                  <p className="font-mono text-xs text-mist-500 truncate max-w-xl">
                    ID: {item.certificateId} · Hash: {item.certificateHash}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <Button
                    variant="secondary"
                    disabled={processingId === item.certificateId}
                    onClick={() => decide(item.certificateId, 'rejected')}
                    className="text-xs py-1.5 px-3 bg-danger-50 text-danger-700 hover:bg-danger-100 border-danger-200"
                  >
                    Reject
                  </Button>
                  <Button
                    disabled={processingId === item.certificateId}
                    onClick={() => decide(item.certificateId, 'approved')}
                    className="text-xs py-1.5 px-3"
                  >
                    {processingId === item.certificateId ? 'Issuing…' : 'Approve & Issue'}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
