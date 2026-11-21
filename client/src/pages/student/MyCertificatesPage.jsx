import { useCallback, useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import CertificateUpload from '../../features/certificates/CertificateUpload.jsx';
import { getMyCertificates } from '../../features/certificates/api.js';
import { QRCodePanel } from '../../features/certificates/QRCodePanel.jsx';

export default function MyCertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    try {
      const result = await getMyCertificates();
      setCertificates(result.certificates || []);
    } catch (requestError) {
      setError(requestError.message || 'Could not load certificates.');
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  return (
    <DashboardLayout role="student">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader eyebrow="Certificates" title="Your certificates" description="Submit certificate details for faculty review. Once approved, the record hash is written to the local credential chain and can be verified publicly." />
        <CertificateUpload onCreated={() => load()} />
        {error && <p role="alert" className="error">{error}</p>}
        <section className="space-y-4">
          <h2 className="font-display text-lg font-semibold">Submitted certificates</h2>
          {certificates.map((certificate) => (
            <article key={certificate.certificateId} className="form-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{certificate.title}</h3>
                  <p className="muted">{certificate.issuer} · {certificate.status}</p>
                  <code>{certificate.certificateId}</code>
                  {certificate.fileUrl && (
                    <div className="mt-2">
                      <a
                        href={certificate.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-clay-600 hover:text-clay-700 underline"
                      >
                        View attached file ↗
                      </a>
                    </div>
                  )}
                </div>
                {certificate.status === 'approved' && <QRCodePanel certificateId={certificate.certificateId} />}
              </div>
            </article>
          ))}
          {!certificates.length && !error && <p className="muted">No certificates submitted yet.</p>}
        </section>
      </div>
    </DashboardLayout>
  );
}
