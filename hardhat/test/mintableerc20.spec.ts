import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import '@nomiclabs/hardhat-waffle';
import { Contract, ContractFactory } from '@ethersproject/contracts';

describe('TFT', function () {
  let MintableERC20Factory: ContractFactory,
    tft: Contract,
    owner: SignerWithAddress,
    acc2: SignerWithAddress,
    acc3: SignerWithAddress;
  before('Get Factory and Signers', async () => {
    MintableERC20Factory = await ethers.getContractFactory('MintableERC20');
    [owner, acc2, acc3] = await ethers.getSigners();
  });
  beforeEach('Deploy factory', async () => {
    tft = await MintableERC20Factory.deploy('Test Fungible Token', 'TFT');
    await tft.deployed();
  });
  describe('Error handling', () => {
    it('Shoud revert unauthorized minter', async () => {
      const amount = ethers.utils.parseUnits('1000', 'ether');
      await expect(tft.connect(acc2).mint(acc3.address, amount)).to.be.revertedWith(
        'Only the owner is authorized to mint tokens'
      );
    });
    it('Shoud revert invalid transfer due to lack of funds', async () => {
      const amount = ethers.utils.parseUnits('1000', 'ether');
      await expect(tft.connect(acc2).transfer(acc3.address, amount)).to.be.revertedWith(
        `InsufficientBalance(${amount}, 0)`
      );
    });
    it('Shoud revert invalid transfer due to no allowance', async () => {
      const amount = ethers.utils.parseUnits('1000', 'ether');
      await tft.mint(acc2.address, amount);
      await expect(tft.connect(acc3).transferFrom(acc2.address, acc3.address, amount)).to.be.revertedWith(
        'There is no allowance to transfer this amount'
      );
    });
  });
  describe('Minting', () => {
    it('Should mint tokens correctly', async () => {
      const amount = ethers.utils.parseUnits('1000', 'ether');
      await tft.mint(acc2.address, amount);
      const acc2Balance = await tft.balanceOf(acc2.address);
      expect(acc2Balance).to.equal(amount);
    });
  });
  describe('Transactions', () => {
    it('Should transfer tokens correctly', async () => {
      const amount = ethers.utils.parseUnits('1000', 'ether');
      const initialAcc2Balance = await tft.balanceOf(acc2.address);
      const initialAcc3Balance = await tft.balanceOf(acc3.address);
      await tft.mint(acc2.address, amount);
      await tft.connect(acc2).transfer(acc3.address, amount);
      const acc2Balance = await tft.balanceOf(acc2.address);
      const acc3Balance = await tft.balanceOf(acc3.address);
      expect(acc2Balance).to.equal(initialAcc2Balance);
      expect(acc3Balance).to.equal(initialAcc3Balance.add(amount));
    });

    it('Should transfer tokens from correctly', async () => {
      const amount = ethers.utils.parseUnits('1000', 'ether');
      const initialAcc2Balance = await tft.balanceOf(acc2.address);
      const initialAcc3Balance = await tft.balanceOf(acc3.address);
      await tft.mint(acc2.address, amount);
      await tft.connect(acc2).approve(acc3.address, amount);
      await tft.connect(acc3).transferFrom(acc2.address, acc3.address, amount);
      const acc2Balance = await tft.balanceOf(acc2.address);
      const acc3Balance = await tft.balanceOf(acc3.address);
      expect(acc2Balance).to.equal(initialAcc2Balance);
      expect(acc3Balance).to.equal(initialAcc3Balance.add(amount));
    });
  });
});
