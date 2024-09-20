import { useEffect, useCallback } from "react";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { ballotsAbi } from "@/lib/abis";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { formSchema } from "@/lib/formSchema";

export function useBallots() {
  const {
    data: hash,
    error,
    isPending,
    writeContractAsync,
    reset: resetWriteContract,
  } = useWriteContract();

  const queryClient = useQueryClient();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const { data: ballots, queryKey } = useReadContract({
    address: import.meta.env.VITE_BALLOT_CONTRACT as `0x${string}`,
    abi: ballotsAbi,
    functionName: "getBallots",
  });

  async function createBallot(values: z.infer<typeof formSchema>) {
    await writeContractAsync({
      address: import.meta.env.VITE_BALLOT_CONTRACT as `0x${string}`,
      abi: ballotsAbi,
      functionName: "create",
      args: [
        values.title,
        values.description,
        values.choices.map((choice) => choice.value),
      ],
    });
  }

  const resetBallotState = useCallback(() => {
    resetWriteContract();
  }, [resetWriteContract]);

  useEffect(() => {
    if (isConfirmed) {
      queryClient.invalidateQueries({ queryKey });
    }
  }, [isConfirmed]);

  return {
    ballots,
    createBallot,
    error,
    isPending,
    isConfirming,
    isConfirmed,
    resetBallotState,
  };
}
