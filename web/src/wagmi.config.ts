import { createConfig, http } from "wagmi";
import { lineaSepolia, hardhat } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const config = createConfig({
  multiInjectedProviderDiscovery: false,
  chains: [hardhat, lineaSepolia],
  connectors: [
    metaMask({
      dappMetadata: {
        name: "Wagmi",
        url: "https://wagmi.io",
        iconUrl: "https://wagmi.io/favicon.ico",
      },
    }),
  ],
  syncConnectedChain: true,
  transports: {
    [hardhat.id]: http("http://127.0.0.1:8545/"),
    [lineaSepolia.id]: http(
      `https://linea-sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_PROJECT_ID}`
    ),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
