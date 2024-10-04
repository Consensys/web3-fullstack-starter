import { useState } from "react";
import { MyNFTs } from "./MyNFTs";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Github } from "lucide-react";

export const Hero = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="container py-12 lg:py-18">
        <div className="mt-5 max-w-2xl text-center mx-auto">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Secure Web3 Voting
          </h1>
        </div>
        <div className="mt-5 max-w-3xl text-center mx-auto">
          <p className="text-xl text-muted-foreground">
            Participate in decentralized voting with our token-gated dApp. 
            Mint your NFTs to gain access and have your voice heard in a 
            transparent, secure blockchain environment.
          </p>
        </div>
        <div className="mt-8 gap-3 flex justify-center">
          <MyNFTs />
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size={"lg"} variant={"outline"}>
                How It Works
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>How It Works</DialogTitle>
                <DialogDescription>
                  Follow these steps to participate in secure Web3 voting:
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Connect your wallet to the dApp.</li>
                  <li>Mint Ballot NFTs to gain voting access.</li>
                  <li>Browse available ballots on the main page.</li>
                  <li>Click on a ballot to view details and options.</li>
                  <li>Choose which of your NFTs to use for voting.</li>
                  <li>Cast your vote using the selected NFT.</li>
                  <li>View the results immediately after voting.</li>
                </ol>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Important: Each NFT can only be used once per ballot, and you can only vote once per ballot regardless of how many NFTs you own. Once an NFT is used for a specific ballot, it cannot be used for that ballot again.
              </p>
              <DialogFooter>
                <Button 
                  size={"sm"} 
                  variant={"outline"}
                  onClick={() => window.open("https://github.com/Consensys/web3-fullstack-starter/tree/main", "_blank")}
                >
                  <Github className="mr-2 h-4 w-4" /> View on GitHub
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
