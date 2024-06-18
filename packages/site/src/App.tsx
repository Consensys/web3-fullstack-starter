import { useAccount } from "wagmi";
import { Connect } from "./components/ConnectButton";
import { useWriteContract } from "wagmi";
import { nftAbi, voteAbi } from "../utils/abis";
import { useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import { SvgCard } from "./components/SvgCard";

// Create a .env variable for these adresses
const NFT_CONTRACT_ADDRESS = "0x701c5b02a8E5740B1c90b815354145aB7963eDcB";
const VOTE_CONTRACT_ADDRESS = "0x6F4CBA788e772d9BA61ed544810336B21607bc18";

export default function Home() {
  const { isConnected, address } = useAccount();
  const [hasVoted, setHasVoted] = useState(false);
  const { data: hash, writeContract } = useWriteContract();

  const { data: voter } = useReadContract({
    address: VOTE_CONTRACT_ADDRESS,
    abi: voteAbi,
    functionName: "voter",
    args: [address],
  });

  const { data: userBalance } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: nftAbi,
    functionName: "balanceOf",
    args: [address],
  });

  useEffect(() => {
    if (voter) {
      setHasVoted(true);
    }
  }, [voter]);

  function mintNFT() {
    try {
      // Create a minting state
      console.log("Minting...");
      writeContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: nftAbi,
        functionName: "safeMint",
        args: [address],
      });
    } catch (error) {
      console.error(error);
    }
  }

  function Vote() {
    try {
      // Create a voting state
      console.log("Voting...");
      writeContract({
        address: VOTE_CONTRACT_ADDRESS,
        abi: voteAbi,
        functionName: "hasVoted",
        args: [address],
      });
    } catch (error) {
      console.error(error);
    }
  }

  const { data: tokenIdsByOwner }: { data: any } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: nftAbi,
    functionName: "getTokensByOwner",
    args: [address],
  });

  const addNft = async () => {
    try {
      tokenIdsByOwner.map(async (id: bigint) => {
        await window.ethereum?.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC721",
            options: {
              address: NFT_CONTRACT_ADDRESS,
              tokenId: id.toString(),
            },
          },
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="relative flex flex-col justify-between items-center gap-20 min-h-screen mx-auto md:p-24">
      <div className=" flex justify-center pt-10 md:pt-0 max-w-5xl w-full lg:items-center lg:justify-between font-mono text-sm lg:flex">
        <div className="absolute bottom-0 left-0 flex w-full items-end justify-center lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            By RAD Team
          </a>
        </div>
        <Connect />
      </div>

      {/* Create a component for this */}
      <div className="space-y-4 text-center">
        <span className="text-3xl w-full font-bold">Web3 Workshop</span>
        {isConnected && (
          <>
            <div className="flex flex-col gap-4 items-center">
              <div>
                {Number(userBalance) && `You own ${Number(userBalance)} NFTs`}
              </div>
              <button
                className="bg-gray-800 text-white px-20 py-2 rounded-md shadow-md hover:bg-opacity-85 hover:shadow-xl duration-200"
                onClick={mintNFT}
              >
                Mint
              </button>

              <button
                className="bg-gray-800 text-white px-20 py-2 rounded-md shadow-md hover:bg-opacity-85 hover:shadow-xl duration-200"
                onClick={addNft}
              >
                Add NFT
              </button>

              {!hasVoted ? (
                <button
                  className="bg-gray-800 text-white px-20 py-2 rounded-md shadow-md hover:bg-opacity-85 hover:shadow-xl duration-200"
                  onClick={Vote}
                >
                  Vote
                </button>
              ) : (
                <div className="text-xl text-green-600">Already Voted</div>
              )}
              <div className="flex gap-4">
                {tokenIdsByOwner &&
                  tokenIdsByOwner.map((id: bigint) => {
                    return <SvgCard key={id} tokenId={Number(id)} />;
                  })}
              </div>
            </div>
            {hash && <div>Transaction Hash: {hash}</div>}
          </>
        )}
      </div>
    </main>
  );
}
