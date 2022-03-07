import { Box, Flex, Heading } from '@chakra-ui/layout';

const Header = () => {
  return (
    <Flex justifyContent="center">
      <Box p="2">
        <Heading size="md">TFT DApp</Heading>
      </Box>
    </Flex>
  );
};

export default Header;
