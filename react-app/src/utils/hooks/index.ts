import { useContractContext } from 'context/ContractContext';
import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

export const useAccountAndChainChange = () => {
  const handleAccountsChanged = () => {
    window.location.reload();
  };
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleAccountsChanged);
    }
    return () => window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
  }, []);
};

export const useBalance = () => {
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));
  const { ctxtAccount, ctxtReadContract } = useContractContext();
  const callbackBalance = useCallback(async () => {
    if (ctxtReadContract && ctxtAccount) {
      const _balance = await ctxtReadContract.balanceOf(ctxtAccount);
      setBalance(_balance);
    }
  }, [ctxtReadContract, ctxtAccount]);
  useEffect(() => {
    const filterReceived = ctxtReadContract?.filters.Transfer(null, ctxtAccount, null);
    const filterSent = ctxtReadContract?.filters.Transfer(ctxtAccount, null, null);
    const getBalance = () => callbackBalance().catch((error) => console.log(error));
    if (filterReceived && filterSent) {
      ctxtReadContract?.on(filterReceived, getBalance);
      ctxtReadContract?.on(filterSent, getBalance);
    }
    return () => {
      if (filterReceived && filterSent) {
        ctxtReadContract?.off(filterReceived, getBalance);
        ctxtReadContract?.off(filterSent, getBalance);
      }
    };
  }, [callbackBalance, ctxtAccount, ctxtReadContract]);
  return balance;
};

export const useSymbol = () => {
  const [symbol, setSymbol] = useState<string>('');
  const { ctxtReadContract } = useContractContext();
  useEffect(() => {
    const getSymbol = async () => {
      const _symbol = await ctxtReadContract?.symbol();
      return _symbol;
    };
    getSymbol()
      .then((_symbol) => setSymbol(_symbol.toString()))
      .catch((error) => console.error(error));
  }, [ctxtReadContract]);
  return symbol;
};
