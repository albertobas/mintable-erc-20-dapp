import { Box, Flex } from '@chakra-ui/layout';
import Header from 'components/Header';

const App = () => {
  return (
    <Box textAlign="center" fontSize="xl">
      <Flex flexDirection="column" minH="100vh" p={3}>
        <Header />
      </Flex>
    </Box>
  );
};

export default App;
