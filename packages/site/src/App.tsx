import { Connect } from "./components/ConnectButton";
import { MintButton } from "./components/MintButton";

export default function Home() {
  return (
    <main className="relative flex flex-col justify-between items-center gap-20 min-h-screen mx-auto md:p-24">
      <div className=" flex justify-center pt-10 md:pt-0 max-w-5xl w-full lg:items-center lg:justify-between font-mono text-sm lg:flex">
        <div className="absolute bottom-0 left-0 flex w-full items-end justify-center lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            By RAD Team
          </a>
        </div>
        <Connect />
      </div>

      <div className="space-y-4 text-center">
        <span className="text-3xl w-full font-bold">Web3 Workshop</span>
        <span className="text-2xl w-full font-bold">NFT Voting App</span>
        <MintButton />
      </div>
    </main>
  );
}
