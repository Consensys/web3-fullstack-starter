import { createConfig, http } from "wagmi";
import { lineaSepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const config = createConfig({
  multiInjectedProviderDiscovery: false,
  chains: [lineaSepolia],
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
    [lineaSepolia.id]: http("https://linea-sepolia.infura.io/v3/2XIxqbP9VIKNwExz861Ss0f7pwn"),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
