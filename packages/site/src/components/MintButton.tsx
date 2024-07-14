import { useAccount } from "wagmi";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useEffect, useState } from "react";
import { nftAbi } from "../../utils/abis";
import { SvgCard } from "./SvgCard";
import { VoteButton } from "./VoteButton";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { ReadContractErrorType } from "wagmi/actions";

export const MintButton = () => {
  const { isConnected, address } = useAccount();
  const [error, setError] = useState<string | null>(null);

  const {
    data: hash,
    writeContractAsync,
    isPending: isMinting,
    error: mintError,
  } = useWriteContract();

  const result = useWaitForTransactionReceipt({ hash });

  const { data: userBalance, refetch: refetchUserBalance } = useReadContract({
    address: import.meta.env.VITE_EXAMPLE_NFT_CONTRACT as `0x${string}`,
    abi: nftAbi,
    functionName: "balanceOf",
    args: [address],
  });

  const { data: tokenIdsByOwner, refetch: refetchTokenIdsByOwner } =
    useReadContract({
      address: import.meta.env.VITE_EXAMPLE_NFT_CONTRACT as `0x${string}`,
      abi: nftAbi,
      functionName: "getTokensByOwner",
      args: [address],
    }) as {
      data: bigint[];
      refetch: (
        options?: RefetchOptions | undefined
      ) => Promise<QueryObserverResult<unknown, ReadContractErrorType>>;
    };

  useEffect(() => {
    if (result) {
      refetchTokenIdsByOwner();
      refetchUserBalance();
    }
  }, [result, refetchTokenIdsByOwner, refetchUserBalance]);

  const mintNFT = async () => {
    try {
      setError(null);
      console.log("Minting...");
      await writeContractAsync({
        address: import.meta.env.VITE_EXAMPLE_NFT_CONTRACT as `0x${string}`,
        abi: nftAbi,
        functionName: "safeMint",
        args: [address],
      });
    } catch (err) {
      setError("Failed to mint NFT");
      console.error(err);
    }
  };

  const addNftToWallet = async () => {
    try {
      setError(null);
      await Promise.all(
        tokenIdsByOwner.map(async (id: bigint) => {
          await window.ethereum.request({
            method: "wallet_watchAsset",
            params: {
              type: "ERC721",
              options: {
                address: import.meta.env
                  .VITE_EXAMPLE_NFT_CONTRACT as `0x${string}`,
                tokenId: id.toString(),
              },
            },
          });
        })
      );
    } catch (err) {
      setError("Failed to add NFT to wallet");
      console.error(err);
    }
  };

  return (
    <div>
      {isConnected && (
        <>
          <div className="flex flex-col gap-4 items-center">
            <div>
              {Number(userBalance) ? `You own ${Number(userBalance)} NFTs` : ""}
            </div>
            <button
              className="bg-gray-800 text-white px-20 py-2 rounded-md shadow-md hover:bg-opacity-85 hover:shadow-xl duration-200"
              onClick={mintNFT}
              disabled={isMinting}
            >
              {isMinting ? "Minting..." : "Mint"}
            </button>

            {tokenIdsByOwner && tokenIdsByOwner.length > 0 && (
              <button
                className="bg-gray-800 text-white px-20 py-2 rounded-md shadow-md hover:bg-opacity-85 hover:shadow-xl duration-200"
                onClick={addNftToWallet}
              >
                Add NFT to Wallet
              </button>
            )}

            <VoteButton address={address} userBalance={userBalance as bigint} />

            <div className="flex gap-4">
              {tokenIdsByOwner &&
                tokenIdsByOwner.map((id: bigint) => (
                  <SvgCard key={id.toString()} tokenId={Number(id)} />
                ))}
            </div>
          </div>
          {hash && <div>Transaction Hash: {hash}</div>}
          {(error || mintError) && (
            <div className="text-red-500 mt-2">
              {error || mintError?.message}
            </div>
          )}
        </>
      )}
    </div>
  );
};
