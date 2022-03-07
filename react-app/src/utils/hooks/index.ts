import { useEffect } from 'react';

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
