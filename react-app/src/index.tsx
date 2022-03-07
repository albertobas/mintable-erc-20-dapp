import * as React from 'react';
import ReactDOM from 'react-dom';
import App from 'App';
import { ChakraProvider, theme } from '@chakra-ui/react';
import ContractProvider from 'utils/context/ContractContext';

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ContractProvider>
        <App />
      </ContractProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
