import { Box, Flex, VStack } from '@chakra-ui/layout';
import Balance from 'components/Balance';
import ConnectEthereum from 'components/ConnectEthereum';
import Header from 'components/Header';
import Panels from 'components/Panels';
import TransactionForm from 'components/TransactionForm';
import { useContractContext } from 'utils/context/ContractContext';
import { useAccountAndChainChange } from 'utils/hooks';

const App = () => {
  useAccountAndChainChange();
  const { ctxtAccount, ctxtReadContract, ctxtWriteContract } = useContractContext();
  return (
    <Box textAlign="center" fontSize="xl">
      <Flex flexDirection="column" minH="100vh" p={3}>
        <Header />
        {ctxtAccount && ctxtReadContract && ctxtWriteContract ? (
          <VStack spacing={8} marginTop="10" alignItems="center">
            <Balance />
            <TransactionForm />
            <Panels />
          </VStack>
        ) : (
          <ConnectEthereum />
        )}
      </Flex>
    </Box>
  );
};

export default App;
