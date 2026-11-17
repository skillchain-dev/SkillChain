import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCertificate } from '../../features/certificates/api.js';
import { QRCodePanel } from '../../features/certificates/QRCodePanel.jsx';

export default function CertificateDetailsPage() {
  const { certificateId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { getCertificate(certificateId).then((data) => setCertificate(data.certificate)).catch((e) => setError(e.message)); }, [certificateId]);
  if (error) return <p className="error">{error}</p>;
  if (!certificate) return <p>Loading certificate...</p>;
  return <><p className="eyebrow">Admin / certificate detail</p><h1>{certificate.title}</h1><div className="detail-grid"><section className="panel"><dl><dt>Credential ID</dt><dd><code>{certificate.certificateId}</code></dd><dt>Student</dt><dd>{certificate.student?.name} · {certificate.student?.email}</dd><dt>Status</dt><dd className="pill">{certificate.status}</dd><dt>Certificate hash</dt><dd><code>{certificate.certificateHash}</code></dd></dl></section>{certificate.status === 'approved' && <QRCodePanel certificateId={certificate.certificateId} />}</div></>;
}