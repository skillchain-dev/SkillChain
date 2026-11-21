const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('SkillChainCredential', function () {
  async function deploy() {
    const [owner, student, other] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory('SkillChainCredential');
    const contract = await Factory.deploy();
    await contract.waitForDeployment();
    return { contract, owner, student, other };
  }

  it('lets the owner issue and publicly verify a credential without storing personal data', async function () {
    const { contract } = await deploy();
    const id = ethers.keccak256(ethers.toUtf8Bytes('credential-1'));
    const certHash = ethers.keccak256(ethers.toUtf8Bytes('certificate'));
    const studentHash = ethers.keccak256(ethers.toUtf8Bytes('student'));
    await expect(contract.issueCredential(id, certHash, studentHash))
      .to.emit(contract, 'CredentialIssued').withArgs(id, certHash, studentHash);
    const [exists, storedHash, issuedAt, revoked] = await contract.verifyCredential(id);
    expect(exists).to.equal(true);
    expect(storedHash).to.equal(certHash);
    expect(issuedAt).to.be.greaterThan(0);
    expect(revoked).to.equal(false);
  });

  it('rejects unauthorized and duplicate issuance and supports revocation', async function () {
    const { contract, other } = await deploy();
    const id = ethers.keccak256(ethers.toUtf8Bytes('credential-2'));
    const certHash = ethers.keccak256(ethers.toUtf8Bytes('certificate'));
    const studentHash = ethers.keccak256(ethers.toUtf8Bytes('student'));
    await expect(contract.connect(other).issueCredential(id, certHash, studentHash)).to.be.revertedWithCustomError(contract, 'NotOwner');
    await contract.issueCredential(id, certHash, studentHash);
    await expect(contract.issueCredential(id, certHash, studentHash)).to.be.revertedWithCustomError(contract, 'CredentialAlreadyExists');
    await contract.revokeCredential(id);
    const [exists, , , revoked] = await contract.verifyCredential(id);
    expect(exists).to.equal(true);
    expect(revoked).to.equal(true);
  });
});