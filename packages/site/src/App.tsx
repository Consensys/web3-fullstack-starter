import { useAccount } from "wagmi";
import { Connect } from "./components/ConnectButton";
import { useWriteContract } from "wagmi";
import { nftAbi, voteAbi } from "../utils/abis";
import { useReadContract } from "wagmi";
import { useEffect, useState } from "react";

export default function Home() {
  const { isConnected, address } = useAccount();
  const [hasVoted, setHasVoted] = useState(false);
  const { data: hash, writeContract } = useWriteContract();

  const { data: voter } = useReadContract({
    // Create env file and add the contract address
    address: "0x6F4CBA788e772d9BA61ed544810336B21607bc18",
    abi: voteAbi,
    functionName: "voter",
    args: [address],
  });

  const { data: userBalance } = useReadContract({
    address: "0x9F1AeE16735e6Cc97e285257dF16453c39dbF97D",
    abi: nftAbi,
    functionName: "balanceOf",
    args: [address],
  });

  useEffect(() => {
    if (voter) {
      setHasVoted(true);
    }
    console.log("User Balance", Number(userBalance));
  }, [voter, userBalance]);

  function mintNFT() {
    try {
      // Create a minting state
      console.log("Minting...");
      writeContract({
        // Create env file and add the contract address
        address: "0x9F1AeE16735e6Cc97e285257dF16453c39dbF97D",
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
        // Create env file and add the contract address
        address: "0x6F4CBA788e772d9BA61ed544810336B21607bc18",
        abi: voteAbi,
        functionName: "hasVoted",
        args: [address],
      });
    } catch (error) {
      console.error(error);
    }
  }

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
              <button
                className="bg-gray-800 text-white px-20 py-2 rounded-md shadow-md hover:bg-opacity-85 hover:shadow-xl duration-200"
                onClick={mintNFT}
              >
                Mint
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
            </div>
            {hash && <div>Transaction Hash: {hash}</div>}

            <button onClick={() => hasMinted()}>See balance</button>
          </>
        )}
      </div>
    </main>
  );
}
