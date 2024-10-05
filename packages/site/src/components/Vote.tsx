import { useCallback, useEffect, useState } from "react";
import { useVoting } from "../hooks/useVoting";
import { useNfts } from "@/hooks/useNfts";
import { SvgCard } from "./SvgCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatErrorMessage } from "@/lib/formatError";

export const Vote = ({
  title,
  ballotId,
  choices,
}: {
  title: string;
  ballotId: number;
  choices: readonly string[];
}) => {
  const [selectedChoice, setSelectedChoice] = useState<number>();
  const { nfts } = useNfts();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedNft, setSelectedNft] = useState<bigint | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const {
    castBallot,
    error,
    isPending,
    isConfirming,
    isConfirmed,
    resetVotingState,
  } = useVoting(ballotId);

  function vote() {
    if (selectedChoice === undefined || selectedNft === undefined) {
      return;
    }

    castBallot(selectedNft, BigInt(selectedChoice));
  }

  useEffect(() => {
    if (isConfirmed) {
      setOpen(false);
    }
  }, [isConfirmed, resetVotingState]);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen);
      if (!newOpen) {
        resetVotingState();
        setCurrentStep(0);
        setSelectedChoice(undefined);
        setSelectedNft(undefined);
      }
    },
    [resetVotingState]
  );

  const eligibleNfts = nfts?.filter((nft) => !nft.isUsed);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full px-8">
          Vote
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] flex flex-col max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription className="text-sm break-words">
            {currentStep === 0
              ? `Pick a NFT that you want to vote with for Ballot #${ballotId.toString()}`
              : "Pick a choice"}
          </DialogDescription>
        </DialogHeader>

        {currentStep === 0 && (
          <ScrollArea className="h-[150px] my-4">
            <div className="grid grid-cols-3 gap-4">
              {eligibleNfts?.map((token) => (
                <div key={token.tokenId} className="relative">
                  <SvgCard
                    token={token.tokenId}
                    onClick={() => setSelectedNft(token.tokenId)}
                  />
                  {selectedNft === token.tokenId && (
                    <Badge
                      className="absolute top-2 right-2 text-xs"
                      variant="secondary"
                    >
                      Selected
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {currentStep === 1 && (
          <div className="flex flex-col gap-2 my-4">
            {choices.map((choice, index) => (
              <Button
                key={index}
                onClick={() => setSelectedChoice(index)}
                variant={selectedChoice === index ? "default" : "outline"}
                className="whitespace-normal p-6"
              >
                <span className="break-words">{choice}</span>
              </Button>
            ))}
          </div>
        )}

        <DialogFooter className="flex justify-between">
          {currentStep === 0 ? (
            <Button
              onClick={() => setCurrentStep(1)}
              disabled={selectedNft === undefined}
            >
              Next
            </Button>
          ) : null}
          {currentStep === 1 ? (
            <>
              <Button onClick={() => setCurrentStep(0)} variant="outline">
                Back
              </Button>
              <Button onClick={vote} disabled={isPending || isConfirming}>
                {isPending || isConfirming ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Vote
              </Button>
            </>
          ) : null}
        </DialogFooter>
        {error && (
          <p className="text-destructive text-sm mt-2 break-words">
            {formatErrorMessage(error)}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};
