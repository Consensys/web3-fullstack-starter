import { createPublicClient, http } from "viem";
import { linea } from "viem/chains";

export const client = createPublicClient({
  chain: linea,
  transport: http(),
});
