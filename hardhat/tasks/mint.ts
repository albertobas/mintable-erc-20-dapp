import { existsSync, readFileSync } from 'fs';
import { task } from 'hardhat/config';
import { join } from 'path';
import '@nomiclabs/hardhat-ethers';

task('mint', 'Mint TFT and internally transfer it to an address')
  .addPositionalParam('receiver', 'The address that will receive them')
  .setAction(async ({ receiver }, hre) => {
    if (hre.network.name === 'hardhat') {
      console.warn(
        'The faucet has been run to the Hardhat Network, so it got automatically created ' +
          "and destroyed. Use the Hardhat option '--network localhost'"
      );
    }
    if (receiver === undefined) {
      console.warn('A recieiver address is required');
    }
    const addressesFilePath = join(__dirname, '../../react-app/src/utils/contracts/contracts-addresses.json');

    if (!existsSync(addressesFilePath)) {
      console.error('You need to deploy your contract first');
      return;
    }

    const addressesJson = readFileSync(addressesFilePath, 'utf-8');
    const address: string = JSON.parse(addressesJson)['MintableERC20'];

    if ((await hre.ethers.provider.getCode(address)) === '0x') {
      console.error('You need to deploy your contract first');
      return;
    }
    const token = await hre.ethers.getContractAt('MintableERC20', address);

    const amount = '100';
    const tftAmount = hre.ethers.utils.parseUnits(amount, 18);
    const tx = await token.mint(receiver, tftAmount);
    await tx.wait();

    console.log(`${amount} TFTs transferred to ${receiver}`);
  });
