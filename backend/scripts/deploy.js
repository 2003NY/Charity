const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // 1. Get the contract factory for EtherCharity
  const EtherCharity = await hre.ethers.getContractFactory("CharityFund");

  // 2. Deploy the contract
  const etherCharity = await EtherCharity.deploy();

  // 3. Wait for deployment to complete
  await etherCharity.waitForDeployment();

  // 4. Get the deployed contract address
  const address = await etherCharity.getAddress();
  console.log("EtherCharity deployed to Sepolia at:", address);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// 0xe9f411D4e7EB76eD4Aa1c19c5Ba57195e521637e