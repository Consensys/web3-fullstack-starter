import { createConfig, http } from "wagmi";
import { lineaSepolia, hardhat } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const config = createConfig({
  multiInjectedProviderDiscovery: false,
  chains: [hardhat],
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
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
