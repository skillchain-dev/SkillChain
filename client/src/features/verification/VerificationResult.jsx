export function VerificationResult({ result }) {
	const status = result?.status || 'Invalid';
	return <div className={`result result-${status.toLowerCase()}`}><span className="status-dot" /><strong>{status}</strong>{result?.certificate?.title && <span>{result.certificate.title}</span>}</div>;
}
