const hre = require('hardhat');
const { ethers } = hre;

async function main() {
  const { CONTRACT_ADDRESS, CERTIFICATE_ID } = process.env;
  if (!CONTRACT_ADDRESS || !CERTIFICATE_ID) throw new Error('Set CONTRACT_ADDRESS and CERTIFICATE_ID.');
  const contract = await ethers.getContractAt('SkillChainCredential', CONTRACT_ADDRESS);
  const credentialId = ethers.keccak256(ethers.toUtf8Bytes(CERTIFICATE_ID));
  const [exists, certificateHash, issuedAt, revoked] = await contract.verifyCredential(credentialId);
  console.log(JSON.stringify({ exists, certificateHash, issuedAt: Number(issuedAt), revoked }, null, 2));
  if (!exists || revoked) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});