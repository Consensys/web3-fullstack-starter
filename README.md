# Workshop Instructions Step byt Step

Start by using the [Create Web3 Template CLI](https://github.com/Consensys/create-web3-template)

```bash
npx @consensys/create-web3-template my-web3-project
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