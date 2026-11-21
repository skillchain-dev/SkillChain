const hre = require('hardhat');

async function main() {
  const factory = await hre.ethers.getContractFactory('SkillChainCredential');
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  console.log(`SkillChainCredential deployed at ${await contract.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});