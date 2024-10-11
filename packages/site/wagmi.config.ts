
import { http, createConfig } from "wagmi";
import { lineaTestnet } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [lineaTestnet],
  connectors: [metaMask()],
  transports: {
    [lineaTestnet.id]: http(),
  },
});
