import { AbiParametersToPrimitiveTypes, ExtractAbiFunction } from "abitype";
import { ballotsAbi } from "../utils/abis";

export type Ballots = AbiParametersToPrimitiveTypes<
  ExtractAbiFunction<typeof ballotsAbi, "getBallots">["outputs"]
>["0"];
