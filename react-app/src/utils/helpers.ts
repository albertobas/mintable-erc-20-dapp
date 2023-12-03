import { ethers, BigNumber } from 'ethers';
import Web3Modal from 'web3modal';
import mintableErc20 from 'utils/contracts/MintableERC20.json';
import { MintableERC20 } from 'utils/types/MintableERC20';

const addresses = require('./contracts/contracts-addresses.json');

export const isEthereum = typeof window.ethereum !== 'undefined';

export const fetchData = async () => {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

  const provider = new ethers.providers.JsonRpcProvider();
  const contract = new ethers.Contract(addresses['MintableERC20'], mintableErc20.abi, provider);

  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const userProvider = new ethers.providers.Web3Provider(connection);
  const signer = userProvider.getSigner();
  const signerContract = new ethers.Contract(addresses['MintableERC20'], mintableErc20.abi, signer) as MintableERC20;

  return { accounts, contract, signerContract };
};

export const formatAmount = (amount: BigNumber, decimals?: number) => {
  const formattedAmount = parseFloat(ethers.utils.formatEther(amount));
  return formattedAmount.toFixed(decimals ? decimals : 4);
};
