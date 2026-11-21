const { ethers } = require('ethers');
const { blockchainRpcUrl, blockchainPrivateKey, blockchainContractAddress } = require('./env');

const credentialAbi = [
  'function issueCredential(bytes32 credentialId, bytes32 certificateHash, bytes32 studentHash)',
  'function verifyCredential(bytes32 credentialId) view returns (bool exists, bytes32 storedCertificateHash, uint64 issuedAt, bool revoked)',
  'function revokeCredential(bytes32 credentialId)',
];

function getCredentialContract() {
  if (!blockchainRpcUrl || !blockchainPrivateKey || !blockchainContractAddress) {
    const error = new Error('Blockchain RPC URL, signing key, and deployed contract address must be configured.');
    error.status = 503;
    error.code = 'BLOCKCHAIN_NOT_CONFIGURED';
    throw error;
  }
  const provider = new ethers.JsonRpcProvider(blockchainRpcUrl);
  const wallet = new ethers.Wallet(blockchainPrivateKey, provider);
  return new ethers.Contract(blockchainContractAddress, credentialAbi, wallet);
}

module.exports = { getCredentialContract };