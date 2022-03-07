import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { ethers } from 'ethers';
import IContract from 'utils/types/IContract';
import { MintableERC20 } from 'utils/types/MintableERC20';

const ContractContext = createContext<IContract>({
  ctxtAccount: null,
  ctxtReadContract: null,
  ctxtWriteContract: null,
  setCtxtAccount: () => {
    null;
  },
  setCtxtReadContract: () => {
    null;
  },
  setCtxtWriteContract: () => {
    null;
  },
});

const ContractProvider: FC<ReactNode> = ({ children }) => {
  const [ctxtAccount, setAccount] = useState<string | null>(null);
  const [ctxtReadContract, setReadContract] = useState<ethers.Contract | null>(null);
  const [ctxtWriteContract, setWriteContract] = useState<MintableERC20 | null>(null);
  const setCtxtAccount = (account: string) => {
    setAccount(account);
  };
  const setCtxtReadContract = (contract: ethers.Contract[]) => {
    setReadContract(contract[0]);
  };
  const setCtxtWriteContract = (contract: MintableERC20[]) => {
    setWriteContract(contract[0]);
  };

  return (
    <ContractContext.Provider
      value={{
        ctxtAccount,
        ctxtReadContract,
        ctxtWriteContract,
        setCtxtAccount,
        setCtxtReadContract,
        setCtxtWriteContract,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export function useContractContext() {
  return useContext(ContractContext);
}

export default ContractProvider;
