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
