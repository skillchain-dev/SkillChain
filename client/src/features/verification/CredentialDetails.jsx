export function CredentialDetails({ certificate }) {
  if (!certificate) return null;

  return (
    <div className="rounded-card border border-mist-200 bg-white p-5 shadow-card">
      <h3 className="font-display text-base font-semibold text-forest-700 border-b border-mist-100 pb-3">
        Credential Details
      </h3>

      <dl className="mt-4 grid grid-cols-1 gap-y-3 sm:grid-cols-2 text-sm">
        <div>
          <dt className="text-xs uppercase tracking-wider text-mist-500 font-medium">Title</dt>
          <dd className="mt-1 font-semibold text-forest-800">{certificate.title}</dd>
        </div>

        <div>
          <dt className="text-xs uppercase tracking-wider text-mist-500 font-medium">Issuing Organization</dt>
          <dd className="mt-1 font-medium text-ink">{certificate.issuer}</dd>
        </div>

        <div>
          <dt className="text-xs uppercase tracking-wider text-mist-500 font-medium">Issue Date</dt>
          <dd className="mt-1 text-ink">
            {certificate.issueDate ? new Date(certificate.issueDate).toLocaleDateString() : 'N/A'}
          </dd>
        </div>

        <div>
          <dt className="text-xs uppercase tracking-wider text-mist-500 font-medium">Status</dt>
          <dd className="mt-1">
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
              {certificate.status}
            </span>
          </dd>
        </div>

        {certificate.student && (
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-wider text-mist-500 font-medium">Issued To (Student)</dt>
            <dd className="mt-1 font-medium text-forest-700">
              {certificate.student.name || 'Verified Student'} {certificate.student.email ? `(${certificate.student.email})` : ''}
            </dd>
          </div>
        )}

        {certificate.fileUrl && (
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-wider text-mist-500 font-medium">Original Document</dt>
            <dd className="mt-1">
              <a
                href={certificate.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-clay-600 hover:text-clay-700 underline"
              >
                View verifiable credential file ↗
              </a>
            </dd>
          </div>
        )}

        <div className="sm:col-span-2">
          <dt className="text-xs uppercase tracking-wider text-mist-500 font-medium">Document SHA-256 Digest</dt>
          <dd className="mt-1 font-mono text-xs text-mist-600 break-all bg-cream p-2 rounded border border-mist-100">
            {certificate.certificateHash || 'Verified hash signature stored on-chain'}
          </dd>
        </div>
      </dl>
    </div>
  );
}

