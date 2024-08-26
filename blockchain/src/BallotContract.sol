// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
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

    struct AVT {
        bool isIssued;
        uint256 ballotId;
        bool hasVoted;
        uint256 timestamp;
        uint256 expiredAt;
    }

    struct TokenInfo {
        uint256 tokenId;
        AVT avt;
    }

    mapping(uint256 => Ballot) public ballots;
    mapping(uint256 => mapping(uint256 => uint256)) public results;
    mapping(uint256 => bool) public isClosed;
    mapping(uint256 => AVT) public issuedAVTs;

    uint256 public ballotCount = 0;

    event BallotCreated(Ballot ballot);
    event AVTCreated(uint256 avt, AVT info);

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

    function issueAVT(
        uint256 tokenId,
        uint256 ballotId
    ) external returns (uint256) {
        require(
            ballotNFT.ownerOf(tokenId) == msg.sender,
            "Caller does not own the NFT"
        );
        require(
            !issuedAVTs[tokenId].isIssued,
            "AVT already issued for this tokenId"
        );
        AVT memory info = AVT(
            true,
            ballotId,
            false,
            block.timestamp,
            block.timestamp + 3600
        );
        issuedAVTs[tokenId] = info;
        uint256 avt = uint256(
            keccak256(abi.encodePacked(tokenId, ballotId, block.timestamp))
        );
        emit AVTCreated(avt, info);
        return avt;
    }

    function mintBallotNFT() external {
        ballotNFT.safeMint(msg.sender);
    }

    function castBallot(
        uint256 ballotId,
        uint256 tokenId,
        uint256 avt,
        uint256 choice
    ) external {
        require(
            ballotNFT.ownerOf(tokenId) == msg.sender,
            "Caller does not own the token"
        );

        AVT storage issuedAVT = issuedAVTs[tokenId];
        require(issuedAVT.isIssued, "AVT not issued for this ballot");
        require(
            issuedAVT.ballotId == ballotId,
            "AVT not issued for this ballot"
        );
        require(
            !issuedAVT.hasVoted,
            "AVT has already been used in this ballot"
        );
        uint256 expectedAVT = uint256(
            keccak256(abi.encodePacked(tokenId, ballotId, issuedAVT.timestamp))
        );
        require(avt == expectedAVT, "Invalid AVT");
        require(block.timestamp <= issuedAVT.expiredAt, "AVT has expired");

        issuedAVT.hasVoted = true;

        results[ballotId][choice] += 1;
    }

    function getResults(uint id) public view returns (uint[] memory) {
        uint[] memory result = new uint[](ballots[id].choices.length);
        for (uint256 i = 0; i < ballots[id].choices.length; i++) {
            result[i] = results[id][i];
        }
        return result;
    }

    function getTokensByOwner(address tokenOwner) public view returns (TokenInfo[] memory) {
        uint256 tokenCount = ballotNFT.balanceOf(tokenOwner);
        TokenInfo[] memory tokenInfos = new TokenInfo[](tokenCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < ballotNFT.nextTokenId(); i++) {
            if (ballotNFT.ownerOf(i) == tokenOwner) {
                tokenInfos[currentIndex] = TokenInfo(i, issuedAVTs[i]);
                currentIndex++;
            }
        }

        return tokenInfos;
    }
}
