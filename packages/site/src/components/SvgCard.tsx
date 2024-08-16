import { useReadContract } from "wagmi";
import { nftAbi } from "../../utils/abis";


interface SvgProps {
  token: {
    tokenId: bigint;
    avt: {
      isIssued: boolean;
      ballotId: bigint;
      hasVoted: boolean;
      timestamp: bigint;
      expiredAt: bigint;
    };
  };
}

export const SvgCard = ({ token }: SvgProps) => {
  const { data: tokenSVG } = useReadContract({
    address:import.meta.env.VITE_BALLOT_NFT_CONTRACT as `0x${string}`,
    abi: nftAbi,
    functionName: "tokenURI",
    args: [token.tokenId],
  });

  return (
    <img
      className="w-full h-full object-contain"
      src={`${tokenSVG}`}
      alt={`Token# ${token.tokenId}`}
    />
  );
};
