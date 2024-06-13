import { useChainId, useConnect, useDisconnect, useAccount } from "wagmi";

export function Connect() {
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const { connectors, connect, status, error } = useConnect();
  const { address, isConnected } = useAccount();

  return (
    <div>
      <h2>Connect</h2>
      {isConnected && (
        <div>
          <div>Connected</div>
          <div>{address}</div>
          <button onClick={() => disconnect()} type="button">
            Disconnect
          </button>
        </div>
      
      )}
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector, chainId })}
          type="button"
        >
          Connect Wallet
        </button>
      ))}
      <div>{status}</div>
      <div>{error?.message}</div>
    </div>
  );
}
