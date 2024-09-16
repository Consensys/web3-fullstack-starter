import { useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { ballotsAbi } from "@/lib/abis";
import { useQueryClient } from "@tanstack/react-query";

export function useNfts() {
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const { address } = useAccount();
  const queryClient = useQueryClient();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const { data: nfts, queryKey } = useReadContract({
    address: import.meta.env.VITE_BALLOT_CONTRACT as `0x${string}`,
    abi: ballotsAbi,
    functionName: "getTokensByOwner",
    args: [address as `0x${string}`],
  });

  function mintNft() {
    try {
      writeContract({
        address: import.meta.env.VITE_BALLOT_CONTRACT as `0x${string}`,
        abi: ballotsAbi,
        functionName: "mintBallotNFT",
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (isConfirmed) {
      queryClient.invalidateQueries({ queryKey });
    }
  }, [isConfirmed, queryClient, queryKey]);

  return {
    nfts,
    mintNft,
    queryKey,
    error,
    isPending,
    isConfirming,
    isConfirmed,
  };
}
