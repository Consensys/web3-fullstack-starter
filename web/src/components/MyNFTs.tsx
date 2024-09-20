import { useNfts } from "../hooks/useNfts";
import { SvgCard } from "./SvgCard";
import { useState } from "react";
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
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatErrorMessage } from "@/lib/formatError";

export const MyNFTs = () => {
  const { nfts, mintNft, isPending, isConfirming, error } = useNfts();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full sm:w-auto px-8">
          My NFTs
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] flex flex-col max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">Your NFTs</DialogTitle>
          <DialogDescription className="text-sm break-words">
            {nfts && nfts.length > 0
              ? `You have ${nfts.length} NFT(s)`
              : "You don't have any NFTs yet."}
          </DialogDescription>
        </DialogHeader>
        {nfts && nfts.length > 0 && (
          <ScrollArea className="h-[150px] my-4">
            <div className="grid grid-cols-3 gap-4">
              {nfts.map((token) => (
                <div key={token.tokenId} className="relative">
                  <SvgCard token={token.tokenId} isUsed={token.isUsed} />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        <div className="mt-auto">
          <DialogFooter className="flex justify-between">
            <Button onClick={mintNft} disabled={isPending || isConfirming}>
              {isPending || isConfirming && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Mint
            </Button>
          </DialogFooter>
          {error && (
            <p className="text-destructive text-sm mt-2 break-words">
              {formatErrorMessage(error)}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
