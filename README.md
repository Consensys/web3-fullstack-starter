# Fullstack Web3 Workshop

Source code: 

# Workshop Instructions Step by Step

we will be working with Foundry in this project, if you do not have Foundry installed before continuing please run:

```bash
curl -L https://foundry.paradigm.xyz | bash
```

You can find these instructions here: [Foundry Install Instructions](https://book.getfoundry.sh/getting-started/installation)

If you are not sure if you have Foundry installed already you can run `foundryup` and if you do not have it installed you will get an error otherwise Foundry STUFF will happen and you will see something like this...

```bash
.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx

 ╔═╗ ╔═╗ ╦ ╦ ╔╗╔ ╔╦╗ ╦═╗ ╦ ╦         Portable and modular toolkit
 ╠╣  ║ ║ ║ ║ ║║║  ║║ ╠╦╝ ╚╦╝    for Ethereum Application Development
 ╚   ╚═╝ ╚═╝ ╝╚╝ ═╩╝ ╩╚═  ╩                 written in Rust.

.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx.xOx
```


Start by using the [Create Web3 Template CLI](https://github.com/Consensys/create-web3-template)

```bash
npx @consensys/create-web3-template my-web3-project
```

```bash
Need to install the following packages:
@consensys/create-web3-template@1.0.5
Ok to proceed? (y)


Creating project with name: my-web3-project
? Please specify a template:  
  Next Web3 Starter 
  React Web3 Starter 
❯ React/Vite and foundry starter 
```

Choose `React/Vite and foundry starter`

```bash
cd my-web3-project && code .
```

you can run `npm i` or `pnpm install`

Next run: 

```bash
npm run install-openzeppelin
```

Remove `Counter.sol` from `src` and delete `script` directory.


This will add the contracts needed for our project to use OpenZeppelin in the `blockchain/lib` directory.


In the `blockchain/src` directory, create two files: 
- `ExampleNFT.sol`
- `Voting.sol`

Cpy the following contract code that our frontend will work with:

```solidity title="ExampleNFT.sol"
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "base64-sol/base64.sol";

contract ExampleNFT is ERC721URIStorage, Ownable {
    uint256 public _nextTokenId = 0;

    event NFTMinted(address indexed _to, uint256 indexed _tokenId);

    constructor() ERC721("ExampleNFT", "XPL") Ownable(msg.sender) {}

    function generateSVGImage(uint256 tokenId)
        public
        pure
        returns (string memory)
    {
        bytes memory svg = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
            "<style>.base { fill: black; font-family: serif; font-size: 14px;}</style>",
            '<rect width="100%" height="100%" fill="white" ry="40" rx="40" style="stroke:#FF2F00; stroke-width:5; opacity:0.9" />',
            '<text x="50%" y="20%" class="base" dominant-baseline="middle" text-anchor="middle">',
            "Example NFT",
            "</text>",
            '<text x="50%" y="30%" class="base" dominant-baseline="middle" text-anchor="middle">',
            string.concat("Token ID: ", Strings.toString(tokenId)),
            "</text>",
            '<text x="1.2%" y="90%" class="base" dominant-baseline="middle" text-anchor="left" style="font-size:10px;"> ',
            "Powered by RAD Team",
            "</text>",
            "</svg>"
        );

        return
            string(
                abi.encodePacked(
                    "data:image/svg+xml;base64,",
                    Base64.encode(svg)
                )
            );
    }

    function safeMint(address minter) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(minter, tokenId);
        _setTokenURI(tokenId, generateSVGImage(tokenId));
        emit NFTMinted(minter, tokenId);
    }
}
```

```solidity title="Voting.sol"
// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Voting is ERC721 {
    address public owner;
    address[] public voters;
    
    mapping(address => bool) public voter;

    event Voted(address voter);

    constructor(address _owner) ERC721("Voting", "VTN") {
        owner = _owner;
    }

    function hasVoted(address voting) public {
        voter[voting] = true;
        voters.push(voting);
        emit Voted(voting);
    }

    function getVoter(uint _index) public view returns (address) {
        return voters[_index];
    }
}
```

In our video workshop we will walk through the code for each contract and explain.


We will be using `base64-sol/base64.sol` which was installed with the openzeppelin script.

## Obfuscating and keeping secrets

When working on a fullstack dapp it's good to know how to use Cast with Forge and store environment variables for terminal commands so that if you are working with others or sharing a screen, you can use variable names and options for commands that deploy contracts ets.. See the section on [Saving Wallet private key with Cast](#saving-wallet-private-key-with-cast)

## Deploying our contracts to Linea

We will need to create the command that we need to do this:

```bash
forge build
```

ensure you are in the blockchain directory....

```bash
forge create --rpc-url https://linea-sepolia.infura.io/v3/<INFURA_KEY> --private-key <PRIVATE_KEY> src/ExampleNFT.sol:ExampleNFT
```

or using cast and env variables:

```bash
forge create --rpc-url https://linea-sepolia.infura.io/v3/$INFURA_API_KEY --account myOwnKey src/ExampleNFT.sol:ExampleNFT
```

The voting contract needs an owner so this command is slightly modified:

```bash
forge create --rpc-url https://linea-sepolia.infura.io/v3/<INFURA_KEY> --private-key <PRIVATE_KEY> src/Voting.sol:Voting --constructor-args <PUBLIC_KEY>
```

or using cast and env variables:

```bash
forge create --rpc-url https://linea-sepolia.infura.io/v3/$INFURA_API_KEY --account myOwnKey src/Voting.sol:Voting --constructor-args <PUBLIC_KEY>
```

Where `<PUBLIC_KEY>` is typed manually because it's not a secret and it's a constructor arg for the contract.

since we are passing a constructor arg for the owner we need the public key on the second command for deploying voting contract.

Do not store your Infura or private key anywhere in your project.

Now that we have deployed both contracts, let's be aware of the contract addresses deployed and copy those into a `.env` file inside of our `packages/site` directory. 

Create a `.env` file in `packages/site`

```
VITE_EXAMPLE_NFT_CONTRACT=<DEPLOYED_TO_ADDRESS>
VITE_VOTING_CONTRACT=<DEPLOYED_TO_ADDRESS>
```


## Init Repo instructions
In the `blockchain` folder install the openzeppelin contracts by running the following command:

```bash
forge install --no-git OpenZeppelin/openzeppelin-contracts
```


## Frontend Dapp

Our CLI has scaffolded out a basic ViteJS + React & TypeScript application with TailwindCSS. Styling is beyond the scope of this workshop, but we will be copying in components and JSX that have tailwind styles.

We already have a `COnnectButton` component that was installed with our CLI. 

We need to add another file in the components directory named: `SvgCard.tsx` and add the following code to it:

```tsx
import { useReadContract } from "wagmi";
import { nftAbi } from "../../utils/abis";

export const SvgCard = ({ tokenId }: { tokenId: number }) => {
  const { data: tokenSVG } = useReadContract({
    address: import.meta.env.VITE_EXAMPLE_NFT_CONTRACT as `0x${string}`,
    abi: nftAbi,
    functionName: "tokenURI",
    args: [tokenId],
  });

  return (
    <img
      width={200}
      height={200}
      src={`${tokenSVG}`}
      alt={`Ticket# ${tokenId}`}
    />
  );
};
```

We will need to copy in the abi for the contracts into the `utility` directory, so let's create that directory and a file named `abis.ts` and add the following abi code:

```ts
export const nftAbi = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "_nextTokenId",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "to", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "owner", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "generateSVGImage",
    inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "getApproved",
    inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTokensByOwner",
    inputs: [{ name: "owner", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256[]", internalType: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isApprovedForAll",
    inputs: [
      { name: "owner", type: "address", internalType: "address" },
      { name: "operator", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "name",
    inputs: [],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "ownerOf",
    inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "safeMint",
    inputs: [{ name: "minter", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "safeTransferFrom",
    inputs: [
      { name: "from", type: "address", internalType: "address" },
      { name: "to", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "safeTransferFrom",
    inputs: [
      { name: "from", type: "address", internalType: "address" },
      { name: "to", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
      { name: "data", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setApprovalForAll",
    inputs: [
      { name: "operator", type: "address", internalType: "address" },
      { name: "approved", type: "bool", internalType: "bool" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "supportsInterface",
    inputs: [{ name: "interfaceId", type: "bytes4", internalType: "bytes4" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "tokenURI",
    inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transferFrom",
    inputs: [
      { name: "from", type: "address", internalType: "address" },
      { name: "to", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "Approval",
    inputs: [
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "approved",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ApprovalForAll",
    inputs: [
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "operator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      { name: "approved", type: "bool", indexed: false, internalType: "bool" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BatchMetadataUpdate",
    inputs: [
      {
        name: "_fromTokenId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "_toTokenId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MetadataUpdate",
    inputs: [
      {
        name: "_tokenId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "NFTMinted",
    inputs: [
      { name: "_to", type: "address", indexed: true, internalType: "address" },
      {
        name: "_tokenId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { name: "from", type: "address", indexed: true, internalType: "address" },
      { name: "to", type: "address", indexed: true, internalType: "address" },
      {
        name: "tokenId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "ERC721IncorrectOwner",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
      { name: "owner", type: "address", internalType: "address" },
    ],
  },
  {
    type: "error",
    name: "ERC721InsufficientApproval",
    inputs: [
      { name: "operator", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "ERC721InvalidApprover",
    inputs: [{ name: "approver", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "ERC721InvalidOperator",
    inputs: [{ name: "operator", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "ERC721InvalidOwner",
    inputs: [{ name: "owner", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "ERC721InvalidReceiver",
    inputs: [{ name: "receiver", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "ERC721InvalidSender",
    inputs: [{ name: "sender", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "ERC721NonexistentToken",
    inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
  },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [{ name: "owner", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
  },
];

export const voteAbi = [
  {
    type: "constructor",
    inputs: [{ name: "_owner", type: "address", internalType: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "to", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "owner", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getApproved",
    inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getVoter",
    inputs: [{ name: "_index", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasVoted",
    inputs: [{ name: "voting", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isApprovedForAll",
    inputs: [
      { name: "owner", type: "address", internalType: "address" },
      { name: "operator", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "name",
    inputs: [],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "ownerOf",
    inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "safeTransferFrom",
    inputs: [
      { name: "from", type: "address", internalType: "address" },
      { name: "to", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "safeTransferFrom",
    inputs: [
      { name: "from", type: "address", internalType: "address" },
      { name: "to", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
      { name: "data", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setApprovalForAll",
    inputs: [
      { name: "operator", type: "address", internalType: "address" },
      { name: "approved", type: "bool", internalType: "bool" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "supportsInterface",
    inputs: [{ name: "interfaceId", type: "bytes4", internalType: "bytes4" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "tokenURI",
    inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transferFrom",
    inputs: [
      { name: "from", type: "address", internalType: "address" },
      { name: "to", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "voter",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "voters",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "Approval",
    inputs: [
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "approved",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ApprovalForAll",
    inputs: [
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "operator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      { name: "approved", type: "bool", indexed: false, internalType: "bool" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { name: "from", type: "address", indexed: true, internalType: "address" },
      { name: "to", type: "address", indexed: true, internalType: "address" },
      {
        name: "tokenId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Voted",
    inputs: [
      {
        name: "voter",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "ERC721IncorrectOwner",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
      { name: "owner", type: "address", internalType: "address" },
    ],
  },
  {
    type: "error",
    name: "ERC721InsufficientApproval",
    inputs: [
      { name: "operator", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "ERC721InvalidApprover",
    inputs: [{ name: "approver", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "ERC721InvalidOperator",
    inputs: [{ name: "operator", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "ERC721InvalidOwner",
    inputs: [{ name: "owner", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "ERC721InvalidReceiver",
    inputs: [{ name: "receiver", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "ERC721InvalidSender",
    inputs: [{ name: "sender", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "ERC721NonexistentToken",
    inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
  },
];
```

At this point the abi import in our `SvgCard.tsx` should be good to go!

## gitignore

Add the following to .gitignore:

```
node_modules
.env
```

## tsconfig

We need to add `paths` to our tsconfig.json

```
{
  "compilerOptions": {
    "target": "ES2020",
    "paths": {
      "@out/*": ["../../blockchain/out/*"]
    },
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src", "src/wagmi.config.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Additional Resources

Below are some optional resources you may need to store environment variables etc..

### Saving Wallet private key with Cast

This is an example of saving a private key with the alias/name of myOwnKey

run:
```bash
cast wallet import myOwnKey --interactive
```

After running this command you will be able to enter a private key and password, both of which will be obfuscated on the screen (if you type or paste it will appear nothing is happening but it is)

Once complete you will see:

```bash
`myOwnKey` keystore was saved successfully. Address: 0x8d4321.....
```

Then you can use your private key for any other commands:


```bash
forge script WhateverSolScriptName.sol --rpc-url http://localhost:8586 --account myOwnKey --sender 0x8d4321.....
```

Where sender is your public key and myOwnKey is the name of your wallet alias/name

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