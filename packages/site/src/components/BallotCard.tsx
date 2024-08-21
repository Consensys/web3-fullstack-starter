import React from "react";
import { useReadContract } from "wagmi";
import { ballotsAbi } from "../../utils/abis";
import { Vote } from "./Vote";
import { GetAvt } from "./GetAVT";
import { SvgCard } from "./SvgCard";
import { Results } from "./Results";
import { useNfts } from "../hooks/useNfts";

interface CardProps {
  id: bigint;
  title: string;
  description: string;
  choices: readonly string[];
}

const BallotCard: React.FC<CardProps> = ({
  id,
  title,
  description,
  choices,
}) => {
  const { data: results } = useReadContract({
    address: import.meta.env.VITE_BALLOT_CONTRACT as `0x${string}`,
    abi: ballotsAbi,
    functionName: "getResults",
    args: [id],
  });

  const { nfts } = useNfts();

  // get the avt, if attached to a nft already
  const nftWithAvt = nfts?.find(
    ({ avt }) => avt.ballotId === id && avt.isIssued
  );

  const isEligible = !!nftWithAvt;
  const hasVoted = nftWithAvt?.avt.hasVoted;
  
  return (
    <div className="card bg-base-100 p-2 shadow-xl">
      <figure>
        {isEligible ? (
          <SvgCard token={nftWithAvt} />
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
                tokenId={nftWithAvt.tokenId}
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
