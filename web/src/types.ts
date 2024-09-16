import { AbiParametersToPrimitiveTypes, ExtractAbiFunction } from "abitype";
import { ballotsAbi } from "@/lib/abis";

export type Ballots = AbiParametersToPrimitiveTypes<
  ExtractAbiFunction<typeof ballotsAbi, "getBallots">["outputs"]
>["0"];
