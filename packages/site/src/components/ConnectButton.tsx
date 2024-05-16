import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

export const ConnectWalletButton = () => {
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();

  const handleConnect = () => {
    if (isConnected) {
      disconnect();
      return;
    }
    const connector = injected({ target: "metaMask" });

    connect({ connector });
  };

  return (
    <button
      onClick={handleConnect}
      className="bg-gray-800 font-sans text-white font-medium py-2 px-4 rounded hover:bg-opacity-80 duration-200 hover:shadow-xl"
    >
      {isConnected ? "Disconnect" : "Connect Wallet"}
    </button>
  );
};
