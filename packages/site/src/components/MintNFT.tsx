import { useNfts } from "../hooks/useNfts";

export const Mint = () => {
  const { mintNft, isPending, isConfirming } = useNfts();

  return (
    <button className="btn btn-primary" onClick={mintNft}>
      {(isPending || isConfirming) && (
        <span className="loading  loading-spinner text-primary"></span>
      )}
      Mint
    </button>
  );
};
