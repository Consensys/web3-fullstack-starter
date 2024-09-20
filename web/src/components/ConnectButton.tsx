import { useConnect, useDisconnect, useAccount } from "wagmi";
import { Button } from "@/components/ui/button";

export function Connect() {
  const { disconnect } = useDisconnect();
  const { connectors, connect } = useConnect();
  const { isConnected } = useAccount();

  if (isConnected) {
    return (
      <Button 
        variant="destructive" 
        onClick={() => disconnect()}
        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
      >
        Disconnect
      </Button>
    );
  }

  return (
    <>
      {connectors.map((connector) => (
        <Button
          key={connector.uid}
          onClick={() => connect({ connector })}
        >
          Connect Wallet
        </Button>
      ))}
    </>
  );
}
