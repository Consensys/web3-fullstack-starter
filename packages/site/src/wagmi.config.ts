import { http, createConfig } from "wagmi";
import { mainnet, sepolia, lineaTestnet } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [lineaTestnet],
  connectors: [metaMask()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [lineaTestnet.id]: http(),
  },
});
