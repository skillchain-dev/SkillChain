import { useEffect, useState } from 'react';
import { getPendingCertificates, reviewCertificate } from '../../features/certificates/api.js';
export default function CertificateApprovalPage() {
	const [items, setItems] = useState([]); const [error, setError] = useState('');
	const load = () => getPendingCertificates().then((data) => setItems(data.certificates)).catch((e) => setError(e.message));
	useEffect(load, []);
	async function decide(id, decision) { try { await reviewCertificate(id, { decision }); await load(); } catch (e) { setError(e.message); } }
	return <><header className="page-heading"><div><p className="eyebrow">Admin / certificates</p><h1>Review queue</h1></div><span className="pill">{items.length} pending</span></header>{error && <p className="error">{error}</p>}<div className="review-list">{items.map((item) => <article className="review-row" key={item.certificateId}><div><a href={`/admin/certificates/${item.certificateId}`}><strong>{item.title}</strong></a><p>{item.certificateId} · {item.student?.name || 'Student'}</p><code>{item.certificateHash}</code></div><div className="actions"><button className="button button-quiet" onClick={() => decide(item.certificateId, 'rejected')}>Reject</button><button className="button" onClick={() => decide(item.certificateId, 'approved')}>Approve & issue</button></div></article>)}{items.length === 0 && <div className="panel">No pending verification requests.</div>}</div></>;
}
