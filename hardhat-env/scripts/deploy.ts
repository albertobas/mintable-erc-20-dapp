import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { ethers, network } from 'hardhat';
import { join } from 'path';

async function main(): Promise<void> {
  if (network.name === 'hardhat') {
    console.warn(
      'The contract has been deployed to the Hardhat Network, so it got automatically created ' +
        "and destroyed. Use the Hardhat option '--network localhost'"
    );
  }
  const contractName = 'MintableERC20';
  const MintableERC20Factory = await ethers.getContractFactory(contractName);
  const tft = await MintableERC20Factory.deploy('Test Fungible Token', 'TFT');
  await tft.deployed();
  console.log(`  ✓ ${contractName} deployed at: ${tft.address}`);

  const reactContractsPath = join(__dirname, '../../react-app/src/utils/contracts');
  const reactContractsAddressPath = join(__dirname, '../../react-app/src/utils/contracts/contracts-addresses.json');

  let addresses = {};
  const pairs = [{ id: contractName, address: tft.address }];
  pairs.forEach((pair) => {
    addresses = { ...addresses, [pair.id]: pair.address };
  });
  if (!existsSync(reactContractsPath)) {
    mkdirSync(reactContractsPath, { recursive: true });
  }
  writeFileSync(reactContractsAddressPath, JSON.stringify(addresses, undefined, 2));
  console.log(`  ✓ ${pairs.length} contract address(es) has(have) been copied to ${reactContractsPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
