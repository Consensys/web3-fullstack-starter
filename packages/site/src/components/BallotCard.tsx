import React from "react";
import { useReadContract } from "wagmi";
import { ballotsAbi } from "../../utils/abis";
import { Vote } from "./Vote";
import { GetAvt } from "./GetAVT";
import { SvgCard } from "./SvgCard";
import { Results } from "./Results";

interface CardProps {
  id: bigint;
  title: string;
  description: string;
  choices: readonly string[];
  to: string;
  tokens:
    | readonly {
        tokenId: bigint;
        avt: {
          isIssued: boolean;
          ballotId: bigint;
          hasVoted: boolean;
          timestamp: bigint;
          expiredAt: bigint;
        };
      }[]
    | undefined;
}

const BallotCard: React.FC<CardProps> = ({
  id,
  title,
  description,
  choices,
  tokens,
}) => {
  const { data: results } = useReadContract({
    address: import.meta.env.VITE_BALLOT_CONTRACT as `0x${string}`,
    abi: ballotsAbi,
    functionName: "getResults",
    args: [id],
  });

  const tokenWithAvt = tokens?.find(
    ({ avt }) => avt.ballotId === id && avt.isIssued
  );

  const isEligible = !!tokenWithAvt;
  const hasVoted = tokenWithAvt?.avt.hasVoted;
  return (
    <div className="card bg-base-100 p-2 shadow-xl">
      <figure>
        {isEligible ? (
          <SvgCard token={tokenWithAvt} />
        ) : (
          <img
            width={200}
            height={200}
            src="/not-eligible.png"
            alt="Not eligible"
          />
        )}
      </figure>

      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
        <div className="card-actions mt-2 w-full">
          {isEligible ? (
            hasVoted ? (
              <Results title={title} choices={choices} results={results} />
            ) : (
              <Vote
                ballotId={id}
                tokenId={tokenWithAvt.tokenId}
                title={title}
                choices={choices}
              />
            )
          ) : (
            <GetAvt ballotId={id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BallotCard;
