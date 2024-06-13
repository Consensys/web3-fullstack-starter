// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {ExampleNFT} from "../src/ExampleNFT.sol";

contract ExampleNFTTest is Test {
    ExampleNFT public ticket;
    address public owner;
    address public nonOwner;

    function setUp() public {
        ticket = new ExampleNFT();
        owner = address(this);
        nonOwner = address(0x1);
    }

    function test_Mint() public {
        address minter = 0xd836D2c9a6e014c2056093BdC4FaA7343CAe80c9;
        ticket.safeMint(minter);
        assertEq(minter, ticket.ownerOf(0));
    }

    function test_SvgImage() public {
        uint256 tokenId = 0;
        string memory svgImage = ticket.generateSVGImage(tokenId);

        string memory expectedSvg = string(
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                Base64.encode(
                    abi.encodePacked(
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
                    )
                )
            )
        );

        assertEq(svgImage, expectedSvg);
    }

    function test_MintMultipleTokens() public {
        address minter1 = 0xd836D2c9a6e014c2056093BdC4FaA7343CAe80c9;
        address minter2 = 0xb5a5F22694352C15B00323844Ad545Abb2b11028;

        ticket.safeMint(minter1);
        ticket.safeMint(minter2);

        assertEq(minter1, ticket.ownerOf(0));
        assertEq(minter2, ticket.ownerOf(1));
    }

    function test_GenerateSvgForDifferentTokenIds() public {
        uint256 tokenId1 = 0;
        uint256 tokenId2 = 1;

        string memory svgImage1 = ticket.generateSVGImage(tokenId1);
        string memory svgImage2 = ticket.generateSVGImage(tokenId2);

        assertTrue(keccak256(bytes(svgImage1)) != keccak256(bytes(svgImage2)));
    }

    function test_OnlyOwnerCanMint() public {
        vm.prank(nonOwner);
        vm.expectRevert("Ownable: caller is not the owner");
        ticket.safeMint(nonOwner);
    }

    function test_NextTokenIdIncrement() public {
        address minter = 0xd836D2c9a6e014c2056093BdC4FaA7343CAe80c9;

        assertEq(ticket._nextTokenId(), 0);

        ticket.safeMint(minter);
        assertEq(ticket._nextTokenId(), 1);

        ticket.safeMint(minter);
        assertEq(ticket._nextTokenId(), 2);
    }
}