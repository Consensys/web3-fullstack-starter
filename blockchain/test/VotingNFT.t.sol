// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {VotingNFT} from "../src/VotingNFT.sol";

contract CounterTest is Test {
    VotingNFT public voting;

    function setUp() public {
        voting = new VotingNFT();
        voting.setNumber(0);
    }

    function test_Increment() public {
        voting.increment();
        assertEq(voting.number(), 1);
    }

    function testFuzz_SetNumber(uint256 x) public {
        voting.setNumber(x);
        assertEq(voting.number(), x);
    }
}
