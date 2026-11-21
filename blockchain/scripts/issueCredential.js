const hre = require('hardhat');
const { ethers } = hre;

async function main() {
  const { CONTRACT_ADDRESS, CERTIFICATE_ID, CERTIFICATE_HASH, STUDENT_ID } = process.env;
  if (!CONTRACT_ADDRESS || !CERTIFICATE_ID || !CERTIFICATE_HASH || !STUDENT_ID) {
    throw new Error('Set CONTRACT_ADDRESS, CERTIFICATE_ID, CERTIFICATE_HASH, and STUDENT_ID.');
  }
  const contract = await ethers.getContractAt('SkillChainCredential', CONTRACT_ADDRESS);
  const credentialId = ethers.keccak256(ethers.toUtf8Bytes(CERTIFICATE_ID));
  const certificateHash = `0x${CERTIFICATE_HASH.replace(/^0x/, '')}`;
  if (!/^0x[0-9a-fA-F]{64}$/.test(certificateHash)) throw new Error('CERTIFICATE_HASH must be a 32-byte hex hash.');
  const studentHash = ethers.keccak256(ethers.toUtf8Bytes(STUDENT_ID));
  const transaction = await contract.issueCredential(credentialId, certificateHash, studentHash);
  await transaction.wait();
  console.log(`Credential ${credentialId} issued in ${transaction.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});