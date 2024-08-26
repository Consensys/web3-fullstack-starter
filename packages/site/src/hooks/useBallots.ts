import { useEffect } from "react";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { ballotsAbi } from "../../utils/abis";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { formSchema } from "../components/CreateBallot";

export function useBallots() {
  const { data: hash, error, isPending, writeContract } = useWriteContract();
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

  function createBallot(values: z.infer<typeof formSchema>) {
    try {
      writeContract({
        address: import.meta.env.VITE_BALLOT_CONTRACT as `0x${string}`,
        abi: ballotsAbi,
        functionName: "create",
        args: [
          values.title,
          values.description,
          values.choices.map((choice) => choice.value),
        ],
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

  return { ballots, createBallot, error, isPending, isConfirming, isConfirmed };
}
