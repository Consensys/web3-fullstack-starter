import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  useAccount,
} from "wagmi";
import { ballotsAbi } from "@/lib/abis";
import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useVoting(ballotId: number) {
  const bigintTypeBallotId = ballotId as unknown as bigint;

  const {
    data: hash,
    error,
    isPending,
    writeContract,
    reset: resetWriteContract,
  } = useWriteContract();

  const { address } = useAccount();

  const queryClient = useQueryClient();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  function castBallot(tokenId: bigint, choice: bigint) {
    writeContract({
      address: import.meta.env.VITE_BALLOT_CONTRACT as `0x${string}`,
      abi: ballotsAbi,
      functionName: "castBallot",
      args: [bigintTypeBallotId, tokenId, choice],
    });
  }

  const { data: hasVoted, queryKey: hasVotedQueryKey } = useReadContract({
    address: import.meta.env.VITE_BALLOT_CONTRACT as `0x${string}`,
    abi: ballotsAbi,
    functionName: "hasVoted",
    args: [address ?? "0x0", bigintTypeBallotId],
  });

  const { data: results, queryKey: resultsQueryKey } = useReadContract({
    address: import.meta.env.VITE_BALLOT_CONTRACT as `0x${string}`,
    abi: ballotsAbi,
    functionName: "getResults",
    args: [bigintTypeBallotId],
  });

  const resetVotingState = useCallback(() => {
    resetWriteContract();
  }, [resetWriteContract]);

  useEffect(() => {
    if (isConfirmed) {
      queryClient.invalidateQueries({ queryKey: resultsQueryKey });
      queryClient.invalidateQueries({ queryKey: hasVotedQueryKey });
      resetVotingState();
    }
  }, [isConfirmed, resetVotingState, queryClient]);

  return {
    castBallot,
    hasVoted,
    results,
    error,
    isPending,
    isConfirming,
    isConfirmed,
    resetVotingState,
  };
}
