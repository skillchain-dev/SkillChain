import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import { getCertificate } from '../../features/certificates/api.js';
import { QRCodePanel } from '../../features/certificates/QRCodePanel.jsx';
import Button from '../../components/ui/Button.jsx';

export default function CertificateDetailsPage() {
  const { certificateId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCertificate(certificateId)
      .then((data) => setCertificate(data.certificate))
      .catch((e) => setError(e.message || 'Could not load certificate details.'))
      .finally(() => setLoading(false));
  }, [certificateId]);

  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader
          eyebrow="Admin / Certificate Details"
          title={certificate?.title || 'Certificate Inspection'}
          description="Detailed credential record and blockchain verification status."
          actions={
            <Link to="/admin/certificates">
              <Button variant="secondary" className="text-xs">
                ← Back to review queue
              </Button>
            </Link>
          }
        />

        {error && (
          <div role="alert" className="rounded-md border border-danger-500/30 bg-danger-50 p-4 text-sm text-danger-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-mist-500 animate-pulse">Loading credential details…</p>
        ) : !certificate ? (
          <p className="text-sm text-mist-500">Certificate not found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-card border border-mist-200 bg-white p-6 shadow-card space-y-4">
              <h2 className="font-display text-lg font-semibold text-forest-700 border-b border-mist-100 pb-2">
                Credential Record
              </h2>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-mist-500 font-medium">Credential ID</dt>
                  <dd className="mt-0.5 font-mono text-xs text-ink font-semibold">{certificate.certificateId}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-mist-500 font-medium">Issuing Body</dt>
                  <dd className="mt-0.5 text-ink">{certificate.issuer}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-mist-500 font-medium">Recipient Student</dt>
                  <dd className="mt-0.5 font-medium text-forest-800">
                    {certificate.student?.name} · {certificate.student?.email}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-mist-500 font-medium">Verification Status</dt>
                  <dd className="mt-0.5">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      certificate.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : certificate.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-danger-50 text-danger-700 border border-danger-200'
                    }`}>
                      {certificate.status}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-mist-500 font-medium">Document SHA-256 Digest</dt>
                  <dd className="mt-0.5 font-mono text-xs text-mist-600 break-all bg-cream p-2 rounded border border-mist-100">
                    {certificate.certificateHash}
                  </dd>
                </div>
                {certificate.fileUrl && (
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-mist-500 font-medium">Uploaded Document</dt>
                    <dd className="mt-1">
                      <a
                        href={certificate.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-clay-600 hover:text-clay-700 underline bg-clay-50 px-2.5 py-1 rounded border border-clay-200"
                      >
                        View original certificate file ↗
                      </a>
                    </dd>
                  </div>
                )}
                {certificate.chainTxHash && (
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-mist-500 font-medium">Ledger Transaction Hash</dt>
                    <dd className="mt-0.5 font-mono text-xs text-forest-700 break-all bg-cream p-2 rounded border border-mist-100">
                      {certificate.chainTxHash}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="space-y-6">
              {certificate.status === 'approved' ? (
                <div className="rounded-card border border-mist-200 bg-white p-6 shadow-card">
                  <h3 className="font-display text-base font-semibold text-forest-700 mb-3">
                    Public Verification QR Code
                  </h3>
                  <p className="text-xs text-mist-600 mb-4">
                    Scan or share this code to verify the certificate on the public credential ledger.
                  </p>
                  <QRCodePanel certificateId={certificate.certificateId} />
                </div>
              ) : (
                <div className="rounded-card border border-mist-200 bg-white p-6 shadow-card">
                  <h3 className="font-display text-base font-semibold text-forest-700 mb-2">
                    Pending Verification
                  </h3>
                  <p className="text-xs text-mist-600 leading-relaxed">
                    This certificate has not yet been approved. Once approved, an immutable cryptographic proof
                    and public verification QR code will be generated.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
