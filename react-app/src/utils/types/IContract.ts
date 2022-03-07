import { ethers } from 'ethers';
import { MintableERC20 } from './MintableERC20';

interface IContract {
  ctxtAccount: string | null;
  ctxtReadContract: ethers.Contract | null;
  ctxtWriteContract: MintableERC20 | null;
  setCtxtAccount(account: string): void;
  setCtxtReadContract(contract: ethers.Contract[]): void;
  setCtxtWriteContract(contract: MintableERC20[]): void;
}

export default IContract;
