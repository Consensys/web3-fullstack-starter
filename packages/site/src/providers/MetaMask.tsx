import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MetaMaskProvider } from "@metamask/sdk-react";
import { config } from "../wagmi.config";

interface WagmiProviderProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

const Provider: React.FC<WagmiProviderProps> = ({ children }) => {
  const host =
    typeof window !== "undefined" ? window.location.host : "defaultHost";

  const sdkOptions = {
    logging: { developerMode: false },
    checkInstallationImmediately: true,
    dappMetadata: {
      name: "React Web3 Starter",
      url: host,
    },
  };

  return (
    <MetaMaskProvider debug={false} sdkOptions={sdkOptions}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </MetaMaskProvider>
  );
};

export default Provider;
