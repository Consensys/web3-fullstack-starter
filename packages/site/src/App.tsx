import { ballotsAbi } from "../utils/abis";
import { useAccount, useReadContract } from "wagmi";
import BallotCard from "./components/BallotCard";
import { NavBar } from "./components/Nav";
import { Hero } from "./components/Hero";
import { useBallots } from "./hooks/useBallots";

export default function Home() {
  const { address } = useAccount();
  const { ballots } = useBallots();

  const { data: tokens } = useReadContract({
    address: import.meta.env.VITE_BALLOT_CONTRACT as `0x${string}`,
    abi: ballotsAbi,
    functionName: "getTokensByOwner",
    args: [address as `0x${string}`],
  });

  return (
    <main className="relative flex flex-col items-center  min-h-screen mx-auto md:p-12">
      <NavBar />
      <Hero />

      <div className="grid mt-4 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
        {ballots &&
          ballots.map((ballot) => {
            return (
              <BallotCard
                key={ballot.id}
                id={ballot.id}
                title={ballot.title}
                description={ballot.description}
                to={`/ballot/${ballot.id}`}
                choices={ballot.choices}
                tokens={tokens}
              />
            );
          })}
      </div>
    </main>
  );
}
