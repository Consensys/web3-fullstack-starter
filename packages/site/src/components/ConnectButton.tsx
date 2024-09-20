import { useState } from "react";
import { useChainId, useConnect, useDisconnect, useAccount } from "wagmi";

export function Connect() {
  const chainId = useChainId();
  const { disconnect, isPending: isDisconnecting } = useDisconnect();
  const {
    connectors,
    connect,
    isPending: isConnecting,
    error: connectError,
  } = useConnect();
  const { address, isConnected } = useAccount();
  const [error, setError] = useState<string | null>(null);

  const handleDisconnect = async () => {
    try {
      setError(null);
      disconnect();
    } catch (err) {
      setError("Failed to disconnect");
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      {isConnected ? (
        <div className="flex gap-4 items-center">
          <div className="w-40 truncate" title={address}>
            {address}
          </div>
          <button
            className={`bg-red-800 text-red-100 px-4 py-2 rounded-md shadow-md duration-150 ${
              isDisconnecting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-opacity-80 hover:shadow-lg"
            }`}
            onClick={handleDisconnect}
            type="button"
            disabled={isDisconnecting}
          >
            {isDisconnecting ? "Disconnecting..." : "Disconnect"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector, chainId })}
              type="button"
              className={`bg-gray-800 text-white px-4 py-2 rounded-md mt-2 ${
                isConnecting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-opacity-80"
              }`}
              disabled={isConnecting}
            >
              {isConnecting
                ? "Connecting..."
                : `Connect with ${connector.name}`}
            </button>
          ))}
        </div>
      )}
      {(error || connectError) && (
        <div className="text-red-500 mt-2">
          {error || connectError?.message}
        </div>
      )}
    </div>
  );
}
