import { useReadContract } from "wagmi";
import { nftAbi } from "@/lib/abis";
import { Badge } from "@/components/ui/badge";

interface SvgProps {
  token: bigint;
  onClick?: () => void;
  isUsed?: boolean;
}

export const SvgCard = ({ token, onClick, isUsed }: SvgProps) => {
  const tokenBigInt = Number(token) as unknown as bigint;
  const { data: tokenSVG } = useReadContract({
    address: import.meta.env.VITE_BALLOT_NFT_CONTRACT as `0x${string}`,
    abi: nftAbi,
    functionName: "tokenURI",
    args: [tokenBigInt],
  });
  
  return (
    <div className="w-full h-full flex items-center justify-center cursor-pointer relative" onClick={onClick}>
      <img
        className="max-w-full max-h-full object-contain"
        src={`${tokenSVG}`}
        alt={`Token# ${token}`}
      />
      {isUsed && (
        <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
          Used
        </Badge>
      )}
    </div>
  );
};
