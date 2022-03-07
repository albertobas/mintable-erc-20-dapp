import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';
import { formatAmount } from '../utils/helpers';
import { useTransactions } from 'utils/hooks';

const Panels = () => {
  const { transfersIn, transfersOut } = useTransactions();
  return (
    <Tabs
      isFitted
      colorScheme="teal"
      width={[
        '100%', // 0-30em
        '100%', // 30em-48em
        '90%', // 48em-62em
        '80%', // 62em+
      ]}
    >
      <TabList minWidth={'100%'}>
        <Tab boxShadow="none" minWidth="50%" _hover={{ color: 'teal' }} _focus={{ outline: 'none' }}>
          Sent
        </Tab>
        <Tab minWidth="50%" _hover={{ color: 'teal' }} _focus={{ outline: 'none' }}>
          Received
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th textAlign="center" width="70%">
                  To
                </Th>
                <Th textAlign="right" paddingRight="2%">
                  Amount
                </Th>
              </Tr>
            </Thead>
            {transfersOut && (
              <Tbody>
                {transfersOut
                  .slice(0)
                  .reverse()
                  .map((event) => {
                    return (
                      event.args && (
                        <Tr key={event.transactionHash} fontSize="sm">
                          <Td textAlign="center">{event.args[1]}</Td>
                          <Td textAlign="right" paddingRight="2%">
                            {formatAmount(event.args[2])}
                          </Td>
                        </Tr>
                      )
                    );
                  })}
              </Tbody>
            )}
          </Table>
        </TabPanel>
        <TabPanel>
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th textAlign="center" width="70%">
                  From
                </Th>
                <Th textAlign="right" paddingRight="2%">
                  Amount
                </Th>
              </Tr>
            </Thead>
            {transfersIn && (
              <Tbody>
                {transfersIn
                  .slice(0)
                  .reverse()
                  .map((event) => {
                    return (
                      event.args && (
                        <Tr key={event.transactionHash} fontSize="sm">
                          <Td textAlign="center">{event.args[0]}</Td>
                          <Td textAlign="right" paddingRight="2%">
                            {formatAmount(event.args[2])}
                          </Td>
                        </Tr>
                      )
                    );
                  })}
              </Tbody>
            )}
          </Table>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default Panels;
