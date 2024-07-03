import { useEffect, useState } from "react";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { voteAbi } from "../../utils/abis";

export const VoteButton = ({
  address,
  userBalance,
}: {
  address: `0x${string}` | undefined;
  userBalance: bigint;
}) => {
  const {
    writeContractAsync,
    isPending,
    data: hash,
    error: writeError,
  } = useWriteContract();
  const [error, setError] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const result = useWaitForTransactionReceipt({ hash });

  const { data: voted, refetch: refetchVoted } = useReadContract({
    address: import.meta.env.VITE_VOTING_CONTRACT as `0x${string}`,
    abi: voteAbi,
    functionName: "voter",
    args: [address],
  });

  useEffect(() => {
    if (voted) {
      setHasVoted(true);
    }
  }, [voted]);

  useEffect(() => {
    if (result) {
      refetchVoted();
    }
  }, [result, refetchVoted]);

  const vote = async () => {
    try {
      setError(null);
      console.log("Voting...");
      await writeContractAsync({
        address: import.meta.env.VITE_VOTING_CONTRACT as `0x${string}`,
        abi: voteAbi,
        functionName: "hasVoted",
        args: [address],
      });
    } catch (err) {
      setError("Failed to vote");
      console.error(err);
    }
  };

  return (
    <>
      {!hasVoted && Number(userBalance) > 0 && (
        <button
          className="bg-gray-800 text-white px-20 py-2 rounded-md shadow-md hover:bg-opacity-85 hover:shadow-xl duration-200"
          onClick={vote}
          disabled={isPending}
        >
          {isPending ? "Voting..." : "Vote"}
        </button>
      )}

      {hasVoted && Number(userBalance) > 0 && (
        <div className="text-xl text-green-600">Already Voted</div>
      )}

      {(error || writeError) && (
        <div className="text-red-500 mt-2">{error || writeError?.message}</div>
      )}
    </>
  );
};
