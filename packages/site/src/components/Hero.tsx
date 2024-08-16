import { MyNFTs } from "./MyNFTs";

export const Hero = () => {
  return (
    <div className="hero mt-4 rounded-2xl bg-base-200">
      <div className="hero-content flex-col justify-center">
        <h1 className="text-5xl font-bold">Web3 voting</h1>
        <p className="py-3 text-2xl">
          Vote with NFTs in our Web3 app. Mint your NFT to start participating
          now!
        </p>

        <MyNFTs />
      </div>
    </div>
  );
};
