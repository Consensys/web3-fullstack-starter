// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "base64-sol/base64.sol";

contract BallotNFT is ERC721URIStorage, Ownable {
    using Strings for uint256;

    uint256 public nextTokenId = 0;
    mapping(uint256 => string) private _tokenURIs;

    event NFTMinted(address indexed _to, uint256 indexed _tokenId);

    constructor() ERC721("BallotNFT", "BLT") Ownable(msg.sender) {}

    function generateSVGImage(
        uint256 tokenId
    ) internal pure returns (string memory) {
        bytes memory svg = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
            "<style>.base { fill: black; font-family: serif; font-size: 14px;}</style>",
            '<rect width="100%" height="100%" fill="white" ry="40" rx="40" style="stroke:#eee; stroke-width:5; opacity:0.9" />',
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

    function safeMint(
        address minter
    ) external returns (uint256) {
        uint256 tokenId = nextTokenId++;
        _safeMint(minter, tokenId);
        _setTokenURI(tokenId, generateSVGImage(tokenId));
        tokenId++;
        emit NFTMinted(minter, tokenId);
        return tokenId;
    }

}
