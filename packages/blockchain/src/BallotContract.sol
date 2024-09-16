// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "./BallotNFT.sol";

contract BallotContract {
    address public owner;
    BallotNFT public ballotNFT;

    constructor(address ballotNFTAddress) {
        ballotNFT = BallotNFT(ballotNFTAddress);
    }

    struct Ballot {
        uint256 id;
        address owner;
        string title;
        string description;
        string[] choices;
    }

    struct UserToken {
        uint256 tokenId;
        bool isUsed;
    }

    mapping(uint256 => Ballot) public ballots;
    mapping(uint256 => mapping(uint256 => uint256)) public results;
    mapping(uint256 => bool) public isClosed;
    mapping(address => mapping(uint256 => bool)) public hasVoted;
    mapping(uint256 => bool) public isTokenUsed;

    uint256 public ballotCount = 0;

    event BallotCreated(Ballot ballot);
    event VoteCast(uint256 ballotId, uint256 tokenId, uint256 choice);

    function create(
        string memory title,
        string memory description,
        string[] memory choices
    ) public {
        Ballot storage newBallot = ballots[ballotCount];
        newBallot.id = ballotCount;
        newBallot.title = title;
        newBallot.description = description;
        newBallot.owner = msg.sender;
        newBallot.choices = choices;

        isClosed[ballotCount] = false;

        for (uint256 i = 0; i < choices.length; i++) {
            results[ballotCount][i] = 0;
        }

        ballotCount++;

        emit BallotCreated(newBallot);
    }

    function getBallots() public view returns (Ballot[] memory) {
        Ballot[] memory result = new Ballot[](ballotCount);
        for (uint256 i = 0; i < ballotCount; i++) {
            result[i] = ballots[i];
        }
        return result;
    }

    function getBallot(uint256 id) public view returns (Ballot memory) {
        return ballots[id];
    }

    function mintBallotNFT() external {
        ballotNFT.safeMint(msg.sender);
    }

    function castBallot(
        uint256 ballotId,
        uint256 tokenId,
        uint256 choice
    ) external {
        require(
            ballotNFT.ownerOf(tokenId) == msg.sender,
            "Caller does not own the token"
        );
        require(!isTokenUsed[tokenId], "Token has already been used");
        require(!isClosed[ballotId], "Ballot is closed");
        require(choice < ballots[ballotId].choices.length, "Invalid choice");
        require(
            !hasVoted[msg.sender][ballotId],
            "User has already voted"
        );

        hasVoted[msg.sender][ballotId] = true;
        isTokenUsed[tokenId] = true;
        results[ballotId][choice] += 1;

        emit VoteCast(ballotId, tokenId, choice);
    }

    function getResults(uint id) public view returns (uint[] memory) {
        uint[] memory result = new uint[](ballots[id].choices.length);
        for (uint256 i = 0; i < ballots[id].choices.length; i++) {
            result[i] = results[id][i];
        }
        return result;
    }

   function getTokensByOwner(address nftOwner) public view returns (UserToken[] memory) {
        uint256 tokenCount = ballotNFT.balanceOf(nftOwner);
        uint256 nextTokenId = ballotNFT.nextTokenId();
        UserToken[] memory userTokens = new UserToken[](tokenCount);
        uint256 index = 0;

        for (uint256 i = 0; i < nextTokenId; i++) {
            if (ballotNFT.ownerOf(i) == nftOwner) {
                UserToken memory userToken;
                userToken.tokenId = i;
                userToken.isUsed = isTokenUsed[i];
                userTokens[index] = userToken;
                index++;
                if (index == tokenCount) {
                    break;
                }
            }
        }

        return userTokens;
    }
}
