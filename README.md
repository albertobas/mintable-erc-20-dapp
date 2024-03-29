# ERC-20 token-specific dapp

[![Apache 2.0 licensed](https://img.shields.io/badge/License-Apache_2.0-yellow.svg)](https://github.com/albertobas/mintable-erc-20-dapp/blob/main/LICENSE)

## About

This repository consists of a decentralized application to operate with a mintable ERC-20 token.

The purpose is to understand the end-to-end process of coding a smart contract in Solidity and developing a specific front-end to interact with this contract.

## Technical details

I use [npm 7 workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces "npm 7 workspaces") to create a monorepo in order to simplify the development environment.

- **Contracts**: [Hardhat](https://hardhat.org)
- **Front-end**: [React.js](https://reactjs.org)
- **Ethereum interaction**: [Ethers.js](https://docs.ethers.io/)
- **Styling**: [Chakra UI](https://chakra-ui.com)

## Overview

- `hardhat-env/contracts/*`: smart contract written in Solidity language.
- `hardhat-env/scripts/*`: Typescript files to deploy contracts, and to share files from the Hardhat workspace to the React app workspace.
- `hardhat-env/tasks/*`: Hardhat task to mint a prespecified amount of tokens and send them to a scpecified address.
- `hardhat-env/test/*`: Typescript file using a hardhat plugin for integration with [Waffle](https://hardhat.org/plugins/nomiclabs-hardhat-waffle.html) and [Ethers.js](https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html) to write the required tests with [Mocha](https://mochajs.org/) alongside [Chai](https://www.chaijs.com/)
- `react-app/public/*`: `index.html`, `manifest.json` and `robots.txt`.
- `react-app/src/components/*`: React.js components in `.tsx`.
- `react-app/src/utils/*`: helper functions, interfaces, hooks and a context.

## Running locally

```bash
$ git clone https://github.com/albertobas/mintable-erc-20-dapp.git
$ cd mintable-erc-20-dapp
$ npm i
$ npm run node
$ npm run compile-share-deploy
$ npm run start-app
$ npm run mint --receiver 0x...
```

`0x...` stands for the address of the receiver account

## Notes

I have written a [blog post](https://www.albertobas.com/blog/mintable-erc-20-dapp) about the end-to-end process of developing this application.
