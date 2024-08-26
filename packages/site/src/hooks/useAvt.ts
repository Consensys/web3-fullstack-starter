import { useState } from "react";
import {
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import { ballotsAbi } from "../../utils/abis";
import { useQueryClient } from "@tanstack/react-query";
import { useNfts } from "./useNfts";

export function useAvt() {
  const [newAvt, setNewAvt] = useState<undefined | bigint>(undefined);
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const queryClient = useQueryClient();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const { queryKey } = useNfts();

  useWatchContractEvent({
    address: import.meta.env.VITE_BALLOT_CONTRACT as `0x${string}`,
    abi: ballotsAbi,
    eventName: "AVTCreated",
    onLogs(logs) {
      setNewAvt(logs[0].args.avt);
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  function getAvt(tokenId: bigint, ballotId: bigint) {
    try {
      writeContract({
        address: import.meta.env.VITE_BALLOT_CONTRACT as `0x${string}`,
        abi: ballotsAbi,
        functionName: "issueAVT",
        args: [tokenId, ballotId],
      });
    } catch (error) {
      console.error(error);
    }
  }

  const refetchData = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  const resetData = () => {
    setNewAvt(undefined)
  }

  return {
    getAvt,
    refetchData,
    resetData,
    newAvt,
    error,
    isPending,
    isConfirming,
    isConfirmed,
  };
}
