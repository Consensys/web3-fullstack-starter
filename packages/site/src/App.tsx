import { NavBar } from "./components/Nav";
import { Hero } from "./components/Hero";
import { useBallots } from "./hooks/useBallots";
import BallotList from "./components/BallotList";

const AppContent = () => {
  const { ballots } = useBallots();

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Hero />
          {!ballots || ballots?.length === 0 ? (
            <div className="text-center mt-8">
              <h2 className="text-2xl font-semibold mb-4">No Active Ballots</h2>
              <p className="text-muted-foreground">
                There are currently no active ballots.
              </p>
            </div>
          ) : (
            <BallotList ballots={ballots} />
          )}
        </div>
      </main>
    </div>
  );
};

export default function Home() {
  return <AppContent />;
}
