import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";

export const ConnectWalletButton = () => {
  const { open } = useWeb3Modal();
  const { isConnected, address } = useAccount();
  const formatAddress = (addr: string | undefined) => {
    return `${addr?.substring(0, 8)}...`;
  };

  return (
    <>
      {isConnected ? (
        <button onClick={() => open()}>
          Connected to: {formatAddress(address)}
        </button>
      ) : (
        <button onClick={() => open()}>Connect Wallet</button>
      )}
    </>
  );
};
