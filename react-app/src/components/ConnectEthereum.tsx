import { Button } from '@chakra-ui/button';
import { Flex } from '@chakra-ui/layout';
import { useContractContext } from 'context/ContractContext';
import { isEthereum, fetchData } from 'utils/helpers';

const ConnectEthereum = () => {
  const { setCtxtAccount, setCtxtReadContract, setCtxtWriteContract } = useContractContext();

  const handleClick = () => {
    fetchData()
      .then(({ accounts, contract, signerContract }) => {
        setCtxtAccount(accounts[0]);
        setCtxtReadContract([contract]);
        setCtxtWriteContract([signerContract]);
      })
      .catch(() =>
        console.log('Data cannot be retrieved. Please double check the status and the address of the contract.')
      );
  };
  return (
    <Flex alignItems="center" minH="90vh" justifyContent="center">
      {isEthereum ? (
        <Button title={'Enable Ethereum'} colorScheme="teal" onClick={handleClick}>
          Enable Ethereum
        </Button>
      ) : (
        <Button
          colorScheme="gray"
          title={'An Ethereum Provider is needed to use this Dapp'}
          className={'disabledBtn'}
          onClick={() => {
            null;
          }}
        >
          An Ethereum Provider is needed to use this DApp
        </Button>
      )}
    </Flex>
  );
};

export default ConnectEthereum;
