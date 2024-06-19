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


In the `blockchain/src` directory. Create two files named: `ExampleNFT.sol` and `Voting.sol` and copy the following contract code that our frontend will work with:

```sol title="ExampleNFT.sol"
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

```sol title="Voting.sol"
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


We will be using `base64-sol/base64.sol`

Remove the `blockchain/test` directory for now and we will cover tests later.

## Deploying our contracts to Linea

We will need to create the command that we need to do this:

```bash
forge build
```

```bash
forge create --rpc-url https://linea-sepolia.infura.io/v3/<INFURA API KEY> --private-key <your_private_key> src/MyContract.sol:MyContract
```

The voting contract needs an owner so this command is slightly modified:

```bash
forge create --rpc-url https://linea-sepolia.infura.io/v3/<INFURA API KEY> --private-key <your_private_key> src/MyContract.sol:MyContract --constructor-args <your_public_key>
```

Do not store your Infura or private key anywhere in your project.

Now that we have deployed both contracts, let's be aware of the contract addresses deployed and copy those into a `.env` file inside of our `packages/site` directory. 

Create a `.env` file in `packages/site`

```
EXAMPLE_NFT_CONTRACT=<DEPLOYED_TO_ADDRESS>
VOTING_CONTRACT=<DEPLOYED_TO_ADDRESS>
```


## Init Repo instructions
In the `blockchain` folder install the openzeppelin contracts by running the following command:
``` 
forge install --no-git OpenZeppelin/openzeppelin-contracts
```


### Blockchain Tests:

Explanation:

**test_SvgImage**
Initializes a `tokenId` and calls the `generateSVGImage` function with this `tokenId`.
Constructs the expected SVG image string based on the `tokenId`.
Asserts that the generated SVG image is equal to the expected SVG image using `assertEq`.
This test ensures that the `generateSVGImage` function returns the correct SVG image data for a given `tokenId`.

**test_MintMultipleTokens**:
Mints two tokens and verifies that each token is owned by the correct address.

**test_GenerateSvgForDifferentTokenIds**:
Generates SVG images for two different token IDs and checks that they are not the same.

**test_OnlyOwnerCanMint**:
Uses vm.prank to simulate a call from a non-owner address and expects a revert.

**test_NextTokenIdIncrement**:
Checks that _nextTokenId increments correctly after each mint.

These tests will help ensure that the ExampleNFT contract functions correctly in various scenarios.

## Frontend Dapp

Our CLI has scaffolded out a basic ViteJS + React & TypeScript application with TailwindCSS. Styling is beyond the scope of this workshop, so let's get the 

## Frontend NPM Packages

@metamask/sdk-react @openzeppelin/contracts hardhat 

## gitignore

Add the following to .gitignore:

```
node_modules
.env
```


## tsconfig

We need to add `paths` to our tsconfig.json

Question for Alejandro: Do we need the /* Hardhat */ settings (comments)

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

    /* Hardhat */
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,

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

