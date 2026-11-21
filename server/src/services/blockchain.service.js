const { ethers } = require('ethers');
const { getCredentialContract } = require('../config/blockchain');

async function issueCredential(certificateId, certificateHash, studentId) {
  const contract = getCredentialContract();
  const credentialId = ethers.keccak256(ethers.toUtf8Bytes(certificateId));
  const hash = `0x${String(certificateHash).replace(/^0x/, '')}`;
  const studentHash = ethers.keccak256(ethers.toUtf8Bytes(String(studentId)));
  if (!/^0x[0-9a-fA-F]{64}$/.test(hash)) {
    const error = new Error('Certificate hash must be a 32-byte SHA-256 hash.');
    error.status = 400;
    error.code = 'INVALID_CERTIFICATE_HASH';
    throw error;
  }
  const transaction = await contract.issueCredential(credentialId, hash, studentHash);
  await transaction.wait();
  return { transactionHash: transaction.hash, credentialId };
}

async function verifyCredential(credentialId, expectedCertificateHash) {
  if (!credentialId || !expectedCertificateHash) {
    return { verified: false, reason: 'BLOCKCHAIN_CREDENTIAL_MISSING' };
  }
  try {
    const contract = getCredentialContract();
    const [exists, storedHash, issuedAt, revoked] = await contract.verifyCredential(credentialId);
    const expectedHash = `0x${String(expectedCertificateHash).replace(/^0x/, '')}`;
    const verified = exists && !revoked && storedHash.toLowerCase() === expectedHash.toLowerCase();
    return { verified, exists, revoked, issuedAt: Number(issuedAt) };
  } catch (error) {
    return { verified: false, reason: error.code || 'BLOCKCHAIN_UNAVAILABLE', error: error.message };
  }
}

module.exports = { issueCredential, verifyCredential };
