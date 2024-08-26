import { useEffect } from "react";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { ballotsAbi } from "../../utils/abis";
import { useQueryClient } from "@tanstack/react-query";

export function useVoting() {
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const queryClient = useQueryClient();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const {
    data: ballots,
    queryKey,
  } = useReadContract({
    address: import.meta.env.VITE_BALLOT_CONTRACT as `0x${string}`,
    abi: ballotsAbi,
    functionName: "getBallots",
  });

  function castBallot(ballotId: bigint, tokenId: bigint, avt: bigint, selectedChoice: bigint) {
    try {
      writeContract({
        address: import.meta.env.VITE_BALLOT_CONTRACT as `0x${string}`,
        abi: ballotsAbi,
        functionName: "castBallot",
        args: [ballotId, tokenId, avt, selectedChoice],
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (isConfirmed) {
      queryClient.invalidateQueries({ queryKey });
    }
  }, [isConfirmed]);

  return { ballots, castBallot, error, isPending, isConfirming, isConfirmed };
}
