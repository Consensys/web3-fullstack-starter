import BallotCard from "./components/BallotCard";
import { NavBar } from "./components/Nav";
import { Hero } from "./components/Hero";
import { useBallots } from "./hooks/useBallots";

export default function Home() {
  const { ballots } = useBallots();


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
                choices={ballot.choices}
              />
            );
          })}
      </div>
    </main>
  );
}
