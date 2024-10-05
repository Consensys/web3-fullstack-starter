import React from "react";
import { Vote } from "./Vote";
import { Results } from "./Results";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useVoting } from "@/hooks/useVoting";
import { Badge } from "@/components/ui/badge";

interface CardProps {
  id: number;
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
  const { hasVoted } = useVoting(id);

  return (
    <Card className="w-full max-w-sm bg-background text-foreground rounded-lg overflow-hidden shadow-md transition-all hover:scale-[1.02] hover:shadow-lg flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {hasVoted && (
          <Badge variant="secondary" className="ml-2">
            Voted
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-sm text-muted-foreground max-h-24 overflow-y-auto pr-2">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter>
        {hasVoted ? (
          <Results id={id} title={title} choices={choices} />
        ) : (
          <Vote ballotId={id} title={title} choices={choices} />
        )}
      </CardFooter>
    </Card>
  );
};

export default BallotCard;
