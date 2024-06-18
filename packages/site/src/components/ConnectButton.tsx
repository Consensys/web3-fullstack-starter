import { useChainId, useConnect, useDisconnect, useAccount } from "wagmi";

export function Connect() {
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const { connectors, connect } = useConnect();
  const { address, isConnected } = useAccount();

  return (
    <div>
      {isConnected ? (
        <div className="flex gap-4 items-center">
          <div className="w-20 truncate">{address}</div>
          <button className="bg-red-800 text-red-100 px-4 py-2 rounded-md hover:bg-opacity-80 shadow-md hover:shadow-lg duration-150" onClick={() => disconnect()} type="button">
            Disconnect
          </button>
        </div>
      ) : (
        <div>
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector, chainId })}
              type="button"
              className="bg-gray-800 text-white px-4 py-2 rounded-md"
            >
              Connect Wallet
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
