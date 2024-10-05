import React from "react";
import BallotCard from "./BallotCard";
import { Ballots } from "@/types";

interface BallotListProps {
  ballots: Ballots;
}

const BallotList: React.FC<BallotListProps> = ({ ballots }) => {
  return (
    <div className="mt-8">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ballots.map((ballot) => {
          return (
            <BallotCard
              key={Number(ballot.id)}
              id={Number(ballot.id)}
              title={ballot.title}
              description={ballot.description}
              choices={ballot.choices}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BallotList;
