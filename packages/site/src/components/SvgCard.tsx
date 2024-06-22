import { useReadContract } from "wagmi";
import { nftAbi } from "../../utils/abis";

const NFT_CONTRACT_ADDRESS = "0x701c5b02a8E5740B1c90b815354145aB7963eDcB";

export const SvgCard = ({ tokenId }: { tokenId: number }) => {
  const { data: tokenSVG } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: nftAbi,
    functionName: "tokenURI",
    args: [tokenId],
  });

  return (
    <img
      width={200}
      height={200}
      src={`${tokenSVG}`}
      alt={`Token# ${tokenId}`}
    />
  );
};
