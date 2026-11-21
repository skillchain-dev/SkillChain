import { useState } from 'react';

export function BlockchainProof({ proof, txHash, credentialId }) {
  const [copied, setCopied] = useState(false);
  const hash = txHash || proof?.transactionHash || proof?.chainTxHash;
  const isVerified = proof?.verified || proof?.exists;

  function copyHash() {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-card border border-mist-200 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between border-b border-mist-100 pb-3">
        <h3 className="font-display text-base font-semibold text-forest-700">Cryptographic Verification Proof</h3>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          isVerified ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${isVerified ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          {isVerified ? 'On-Chain Verified' : 'Off-Chain Record'}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-y-3 sm:grid-cols-2 text-sm">
        <div>
          <dt className="text-xs uppercase tracking-wider text-mist-500 font-medium">Smart Contract State</dt>
          <dd className="mt-1 font-medium text-forest-800">
            {proof?.revoked ? 'Revoked' : isVerified ? 'Valid & Immutable' : proof?.reason || 'Record Active'}
          </dd>
        </div>

        <div>
          <dt className="text-xs uppercase tracking-wider text-mist-500 font-medium">Timestamp</dt>
          <dd className="mt-1 text-ink">
            {proof?.issuedAt ? new Date(proof.issuedAt * 1000).toLocaleString() : 'Registered on SkillChain'}
          </dd>
        </div>

        {credentialId && (
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-wider text-mist-500 font-medium">Credential On-Chain ID</dt>
            <dd className="mt-1 font-mono text-xs text-mist-700 break-all bg-cream p-2 rounded border border-mist-100">
              {credentialId}
            </dd>
          </div>
        )}

        {hash && (
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-wider text-mist-500 font-medium flex items-center justify-between">
              <span>Transaction Hash</span>
              <button
                type="button"
                onClick={copyHash}
                className="text-clay-600 hover:text-clay-700 text-xs font-semibold"
              >
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
            </dt>
            <dd className="mt-1 font-mono text-xs text-forest-700 break-all bg-cream p-2 rounded border border-mist-100">
              {hash}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}

