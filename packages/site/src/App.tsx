import { useAccount } from "wagmi";
import { Connect } from "./components/ConnectButton";
import { nftAbi, voteAbi } from "../utils/abis";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useEffect, useState } from "react";
import { SvgCard } from "./components/SvgCard";

export default function Home() {
  const { isConnected, address } = useAccount();
  const [hasVoted, setHasVoted] = useState(false);
  const { data: hash, writeContract, isSuccess } = useWriteContract();

  const result = useWaitForTransactionReceipt({ hash });

  const { data: voted, refetch: refetchVoted } = useReadContract({
    address: import.meta.env.VITE_VOTING_CONTRACT as `0x${string}`,
    abi: voteAbi,
    functionName: "voter",
    args: [address],
  });

  const { data: userBalance, refetch: refetchUserBalance } = useReadContract({
    address: import.meta.env.VITE_EXAMPLE_NFT_CONTRACT as `0x${string}`,
    abi: nftAbi,
    functionName: "balanceOf",
    args: [address],
  });

  const { data: tokenIdsByOwner, refetch: refetchTokenIdsByOwner }: { data: any; refetch: any } =
    useReadContract({
      address: import.meta.env.VITE_EXAMPLE_NFT_CONTRACT as `0x${string}`,
      abi: nftAbi,
      functionName: "getTokensByOwner",
      args: [address],
    });

  useEffect(() => {
    if (voted) {
      setHasVoted(true);
    }
  }, [voted]);

  useEffect(() => {
    if (result) {
      refetchTokenIdsByOwner();
      refetchVoted();
      refetchUserBalance();
    }
  }, [isSuccess, refetchTokenIdsByOwner, refetchUserBalance, refetchVoted, result]);

  function mintNFT() {
    try {
      // Create a minting state
      console.log("Minting...");
      writeContract({
        address: import.meta.env.VITE_EXAMPLE_NFT_CONTRACT as `0x${string}`,
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
        address: import.meta.env.VITE_VOTING_CONTRACT as `0x${string}`,
        abi: voteAbi,
        functionName: "hasVoted",
        args: [address],
      });
    } catch (error) {
      console.error(error);
    }
  }

  const addNft = async () => {
    try {
      tokenIdsByOwner.map(async (id: bigint) => {
        await window.ethereum?.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC721",
            options: {
              address: import.meta.env.VITE_EXAMPLE_NFT_CONTRACT as `0x${string}`,
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
                {Number(userBalance) ? `You own ${Number(userBalance)} NFTs` : ""}
              </div>
              <button
                className="bg-gray-800 text-white px-20 py-2 rounded-md shadow-md hover:bg-opacity-85 hover:shadow-xl duration-200"
                onClick={mintNFT}
              >
                Mint
              </button>

              {
                tokenIdsByOwner !== undefined && tokenIdsByOwner.length > 0 ? <button
                  className="bg-gray-800 text-white px-20 py-2 rounded-md shadow-md hover:bg-opacity-85 hover:shadow-xl duration-200"
                  onClick={addNft}
                >
                  Add NFT
                </button>
                  : <></>
              }

              {!hasVoted && Number(userBalance) > 0 && (
                <button
                  className="bg-gray-800 text-white px-20 py-2 rounded-md shadow-md hover:bg-opacity-85 hover:shadow-xl duration-200"
                  onClick={Vote}
                >
                  Vote
                </button>
              )}

              {hasVoted && Number(userBalance) > 0 && (
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