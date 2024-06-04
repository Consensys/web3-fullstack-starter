// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {ExampleNFT} from "../src/ExampleNFT.sol";

contract CounterTest is Test {
    ExampleNFT public ticket;

    function setUp() public {
        ticket = new ExampleNFT();
    }

    function test_Mint() public {
        ticket.safeMint(0xd836D2c9a6e014c2056093BdC4FaA7343CAe80c9);
        assertEq(ticket, ticket.ownerOf(0));
    }

    // function test_SvgImage() public view {
    //     string memory svg = ticket.generateSVGImage(0);
    //     assertEq(svg, "asd");
    // }
}
