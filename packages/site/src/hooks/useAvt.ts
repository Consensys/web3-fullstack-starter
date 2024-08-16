import { useState } from "react";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import { ballotsAbi } from "../../utils/abis";
import { useQueryClient } from "@tanstack/react-query";

export function useAvt() {
  const [newAvt, setNewAvt] = useState<undefined | bigint>(undefined);
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const { address } = useAccount();
  const queryClient = useQueryClient();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const { data: nftsWithAvt, queryKey } = useReadContract({
    address: import.meta.env.VITE_BALLOT_CONTRACT as `0x${string}`,
    abi: ballotsAbi,
    functionName: "getTokensByOwner",
    args: [address as `0x${string}`],
  });

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

  return {
    nftsWithAvt,
    getAvt,
    refetchData,
    newAvt,
    error,
    isPending,
    isConfirming,
    isConfirmed,
  };
}
