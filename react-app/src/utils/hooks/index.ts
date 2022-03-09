import { useContractContext } from 'utils/context/ContractContext';
import { BigNumber, Event, EventFilter } from 'ethers';
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
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleAccountsChanged);
    };
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

export const useTransactions = () => {
  const [transfersIn, setTransfersIn] = useState<Event[] | null>(null);
  const [transfersOut, setTransfersOut] = useState<Event[] | null>(null);
  const { ctxtAccount, ctxtReadContract } = useContractContext();
  const callbackEvent = useCallback(
    async (filter: EventFilter | undefined) => {
      if (filter) {
        const _events = await ctxtReadContract?.queryFilter(filter, 0, 'latest');
        return _events ? _events : null;
      } else return null;
    },
    [ctxtReadContract]
  );
  useEffect(() => {
    const filterReceived = ctxtReadContract?.filters.Transfer(null, ctxtAccount, null);
    const filterSent = ctxtReadContract?.filters.Transfer(ctxtAccount, null, null);
    const getReceived = () =>
      callbackEvent(filterReceived)
        .then((_events) => {
          setTransfersIn(_events);
          console.log('You have received a transaction, please click on the received tab in the transaction panel.');
        })
        .catch((error) => console.error(error));
    const getSent = () =>
      callbackEvent(filterSent)
        .then((_events) => setTransfersOut(_events))
        .catch((error) => console.error(error));
    if (filterReceived && filterSent) {
      ctxtReadContract?.on(filterReceived, getReceived);
      ctxtReadContract?.on(filterSent, getSent);
    }
    return () => {
      if (filterReceived && filterSent) {
        ctxtReadContract?.off(filterReceived, getReceived);
        ctxtReadContract?.off(filterSent, getSent);
      }
    };
  }, [ctxtReadContract, ctxtAccount, callbackEvent]);
  return { transfersIn, transfersOut };
};
