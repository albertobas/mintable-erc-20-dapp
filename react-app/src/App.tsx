import { Box, Flex } from '@chakra-ui/layout';
import Header from 'components/Header';
import { useContractContext } from 'context/ContractContext';
import { useAccountAndChainChange } from 'utils/hooks';

const App = () => {
  useAccountAndChainChange();
  const { ctxtAccount, ctxtReadContract, ctxtWriteContract } = useContractContext();
  return (
    <Box textAlign="center" fontSize="xl">
      <Flex flexDirection="column" minH="100vh" p={3}>
        <Header />
      </Flex>
    </Box>
  );
};

export default App;
