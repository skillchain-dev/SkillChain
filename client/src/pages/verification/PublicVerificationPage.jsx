import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verificationApi } from '../../features/verification/api.js';
import { VerificationResult } from '../../features/verification/VerificationResult.jsx';
import { BlockchainProof } from '../../features/verification/BlockchainProof.jsx';
import { CredentialDetails } from '../../features/verification/CredentialDetails.jsx';
import { QRCodePanel } from '../../features/certificates/QRCodePanel.jsx';
import Button from '../../components/ui/Button.jsx';

export default function PublicVerificationPage() {
  const { certificateId: routeId } = useParams();
  const [id, setId] = useState(routeId || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const executeVerify = useCallback(async (targetId) => {
    const trimmed = String(targetId || '').trim();
    if (!trimmed) return;
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const data = await verificationApi.verify(trimmed);
      setResult(data);
    } catch (e) {
      setError(e.message || 'Verification failed. No matching active credential found.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (routeId) {
      setId(routeId);
      executeVerify(routeId);
    }
  }, [routeId, executeVerify]);

  async function handleSubmit(event) {
    event.preventDefault();
    executeVerify(id);
  }

  return (
    <main className="mx-auto max-w-shell px-6 py-12 sm:py-16">
      <div className="max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-clay-500">
          SkillChain Public Registry
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-forest-700 sm:text-4xl">
          Verify a credential
        </h1>
        <p className="mt-2 text-base text-mist-600">
          Check cryptographic credential records without exposing student personal documents.
          Enter a credential identifier or scan its QR code to inspect on-chain validity.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl">
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="e.g. CERT-GLA-2026-001"
          required
          className="flex-1 rounded-md border border-mist-300 bg-white px-4 py-2.5 text-sm font-medium text-ink focus:border-clay-500 focus:outline-none"
        />
        <Button type="submit" disabled={loading} className="whitespace-nowrap">
          {loading ? 'Verifying…' : 'Verify Credential'}
        </Button>
      </form>

      {error && (
        <div role="alert" className="mt-6 max-w-xl rounded-md border border-danger-500/30 bg-danger-50 p-4 text-sm text-danger-700">
          {error}
        </div>
      )}

      {loading && (
        <p className="mt-8 text-sm text-mist-500 animate-pulse">
          Consulting cryptographic registry and verification ledger…
        </p>
      )}

      {result && (
        <div className="mt-10 space-y-6 max-w-3xl">
          <div className="rounded-card border border-mist-200 bg-white p-6 shadow-card">
            <VerificationResult result={result} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <CredentialDetails certificate={result.certificate} />
            <div className="space-y-6">
              <BlockchainProof
                proof={result.blockchain}
                txHash={result.certificate?.chainTxHash}
                credentialId={result.certificate?.chainCredentialId}
              />
              {result.certificate?.certificateId && (
                <div className="rounded-card border border-mist-200 bg-white p-5 shadow-card">
                  <h3 className="font-display text-base font-semibold text-forest-700 mb-3">
                    Public Shareable QR Code
                  </h3>
                  <QRCodePanel certificateId={result.certificate.certificateId} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-16 border-t border-mist-200 pt-8 flex items-center justify-between text-sm text-mist-500">
        <span>Looking for talent with verified credentials?</span>
        <Link to="/explore-talent" className="font-semibold text-clay-600 hover:text-clay-700 underline">
          Browse verified talent directory →
        </Link>
      </div>
    </main>
  );
}
