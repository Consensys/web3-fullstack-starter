// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "base64-sol/base64.sol";

contract BallotNFT is ERC721URIStorage, Ownable {
    using Strings for uint256;

    uint256 public nextTokenId = 0;

    event NFTMinted(address indexed _to, uint256 indexed _tokenId);

    constructor() ERC721("BallotNFT", "BLT") Ownable(msg.sender) {}

    function _generateSVGImage(uint256 tokenId) internal pure returns (string memory) {
        bytes memory svg = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 200 200">',
            '<defs>',
            '<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" style="stop-color:rgb(255,50,50);stop-opacity:1" />',
            '<stop offset="100%" style="stop-color:rgb(50,50,255);stop-opacity:1" />',
            '</linearGradient>',
            '</defs>',
            '<rect width="200" height="200" fill="url(#grad)" rx="25" ry="25" />',
            '<circle cx="100" cy="100" r="60" fill="white" opacity="0.3" />',
            '<text x="100" y="90" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle">Ballot NFT</text>',
            '<text x="100" y="120" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">#',
            Strings.toString(tokenId),
            '</text>',
            '</svg>'
        );

        return string(
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                Base64.encode(svg)
            )
        );
    }

    function safeMint(address minter) external returns (uint256) {
        uint256 tokenId = nextTokenId++;
        _safeMint(minter, tokenId);
        _setTokenURI(tokenId, _generateSVGImage(tokenId));
        emit NFTMinted(minter, tokenId);
        return tokenId;
    }
}
