# Fullstack Web3 Workshop

This workshop is designed with the needs of hackers and builders in mind. A hands-on experience that will guide you through the process of building a full-stack web3 dapp with ViteJS React + TypeScript, Viem, Wagmi and MetaMask deployed to the Linea Seploia testnet using Foundry.

## About This Workshop

To create this project we used the [create-web3-template](https://github.com/Consensys/create-web3-template) CLI to scaffold a mono repo (all in one repository) containing a `blockchain` and `site` directory. With this CLI, you can choose to work with hardhat or foundry and we chose Foundry, so the information below is specific to the Foundry option. 

Understand that to simply clone and run this repo, you do not need to know much about the CLI but the architecture is such because we used it as our starting point.

Our workshop and the code within is a fundamental example of a real world fullstack dapp and we think it is a good starter application that uses our various Consensys products like [Linea](https://linea.build/) which we deploy to the [Sepolia](https://sepolia.lineascan.build/) testnet. We have examples of interacting with those contracts via the web dApp using the [TanStack Query for React](https://tanstack.com/query/latest). We cover some edge cases that are important in a dApp to ensure after [reading](https://wagmi.sh/react/api/hooks/useReadContracts) and [writing](https://wagmi.sh/react/api/hooks/useWriteContracts#usewritecontracts) to the contracts with Wagmi Hooks are shown and use interesting hooks like: [wait for transaction receipts](https://wagmi.sh/react/api/hooks/useWaitForTransactionReceipt#usewaitfortransactionreceipt) to [refetch](https://wagmi.sh/vue/api/composables/useReadContract#refetch) queries and refresh your UI so that your dApp does not have to be hard-refreshed.

As developers who work closely with Web3 hackers worldwide, what is covered in this workshop should take minimal time for novice developers to understand and can help you understand basic concepts without having to build them your self from scratch.

We've carefully selected the most widely used technologies in Web3 and incorporated them into practical, real-world examples. This ensures that the knowledge gained in this workshop is comprehensive and immediately applicable to your work, saving you from unnecessary digging or seeking external help.

This workshop was created by:

- Alejandro Mena
  - [@_cxalem](https://twitter.com/_cxalem)
- Chinthaka Weerakkody
  - [@chin_flags](https://x.com/chin_flags)
- Eric Bishard
  - [@httpJunkie](https://twitter.com/httpjunkie)

  You can reach out to any of us on Social for help or in case you want to contribute.

## Prerequisites

We will be working with Foundry in this project, if not already installed, you can run:

```bash
curl -L https://foundry.paradigm.xyz | bash
```

You can find these instructions here: [Foundry Install Instructions](https://book.getfoundry.sh/getting-started/installation)

If you are not sure if you have Foundry installed already, you can run `foundryup` and if you do not have it installed you will get an error otherwise Foundry STUFF will happen and you will see something like this...

```bash
.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx

 ╔═╗ ╔═╗ ╦ ╦ ╔╗╔ ╔╦╗ ╦═╗ ╦ ╦         Portable and modular toolkit
 ╠╣  ║ ║ ║ ║ ║║║  ║║ ╠╦╝ ╚╦╝    for Ethereum Application Development
 ╚   ╚═╝ ╚═╝ ╝╚╝ ═╩╝ ╩╚═  ╩                 written in Rust.

.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx
```

## Clone Install Build Contracts and Run Project

To run the project locally, start by cloning the repository and change directories, and/or open with VS Code:

```zsh
git clone https://github.com/Consensys/web3-fullstack-starter && cd web3-fullstack-starter && code .
```

Install dependencies:

```zsh
pnpm i
```

Install Open Zeppelin contracts:

```zsh
pnpm run install-openzeppelin
```

Build contracts with Forge:

```zsh
cd packages/blockchain && forge build
```

Deploy `BallotNFT` contract:

```bash
forge create --rpc-url https://linea-sepolia.infura.io/v3/<INFURA_KEY> --private-key <PRIVATE_KEY> src/BallotNFT.sol:BallotNFT
```

or using cast and env variables:

```bash
forge create --rpc-url https://linea-sepolia.infura.io/v3/$INFURA_API_KEY --account myCastAccountName src/BallotNFT.sol:BallotNFT
```

Deploy `BallotContract` contract:

```bash
forge create --rpc-url https://linea-sepolia.infura.io/v3/<INFURA_KEY> --private-key <PRIVATE_KEY> src/BallotContract.sol:BallotContract --constructor-args <PUBLIC_KEY>
```

or using cast and env variables:

```bash
forge create --rpc-url https://linea-sepolia.infura.io/v3/$INFURA_API_KEY --account myCastAccountName src/BallotContract.sol:BallotContract --constructor-args <PUBLIC_KEY>
```

Change the filename of `.env.example` to `.env` and then copy `BallotNFT` and `BallotContract` contract address from `DeployedTo:` (in our terminal) to environment variable file:

> *Understand that even if we have exported our Infura API key for use in the terminal, we still need to have the Infura API key in our environment variable file so that the web dapp has access to it.

```zsh
VITE_BALLOT_NFT_CONTRACT=<DEPLOYED_TO_ADDRESS>
VITE_BALLOT_CONTRACT=<DEPLOYED_TO_ADDRESS>
INFURA_PROJECT_ID=<INFURA_PROJECT_ID>
```

Run the dApp:

```zsh
cd ../packages/site && npm run dev
```



Copy the contract address printed after `Deployed to:` into the `VITE_BALLOT_NFT_CONTRACT` variable in `.env`

### Run the Web dApp

Change into `packages/site` and run project:

```bash
cd ../packages/site && npm run dev
```

## Saving Wallet private key with Cast

If you are new to Foundry, we have put together some of the basics on working with this tool below. This information is not needed if you already have Foundry and understand how to use it, but if not, here are some tips.

### Saving a private key with an alias and Foundry account name

> *Remember that `myCastAccountName` is not what your alias is named, so ensure that when you see this variable in the commands that you swap it out with your own alias.

run:
```bash
cast wallet import myCastAccountName --interactive
```

After running this command you will be able to enter a private key and password, both of which will be obfuscated on the screen (if you type or paste it will appear nothing is happening but it is)

Once complete you will see:

```bash
`myCastAccountName` keystore was saved successfully. Address: 0x8d4321.....
```

Then you can use your private key for any other commands:


```bash
forge script WhateverSolScriptName.sol --rpc-url http://localhost:8586 --account myCastAccountName --sender 0x8d4321.....
```

Where sender is your public key and myCastAccountName is the name of your wallet alias/name

### Saving an API key

You may want to store your Infura or other API keys for use with Forge in an environment variable that your command line can reference. I'm using an Infura account, so here is how I would do that:

using zsh:

```zsh
echo 'export INFURA_API_KEY=your_api_ke' >> ~/.zshrc
source ~/.zshrc
```

using bash:

```bash
echo 'export INFURA_API_KEY=your_api_key' >> ~/.bashrc
source ~/.bashrc
```

Once you have run those commands you can check the value and ensure it's there with the following command:

```bash
echo $INFURA_API_KEY
```

And with that example you can also see how you would use that variable in a command, with forge it might look something like this:

```bash
forge create --rpc-url https://linea-sepolia.infura.io/v3/$INFURA_API_KEY --private-key <PRIVATE_KEY> src/MyNFT.sol:MyNFT
```