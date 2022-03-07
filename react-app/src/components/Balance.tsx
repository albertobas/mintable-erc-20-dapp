import { Heading } from '@chakra-ui/layout';
import { useBalance, useSymbol } from 'utils/hooks';
import { formatAmount } from 'utils/helpers';

const Balance = () => {
  const balance = useBalance();
  const symbol = useSymbol();
  const formattedBalance = formatAmount(balance);
  return (
    <Heading as="h1" size="3xl">
      {formattedBalance} {symbol}
    </Heading>
  );
};

export default Balance;
