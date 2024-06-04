// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyToken is ERC721 {
    address public owner;
    mapping (address => bool ) public voted;

    constructor(address _owner) ERC721("MyToken", "MTK") {
        owner = _owner;
    }

    function hasVoted(address voter) public view returns (bool) {
        return voted[voter] == true;
    }
}