import { Connect } from "./ConnectButton";
import { CreateBallot } from "./CreateBallot";

export function NavBar() {
  return (
    <div className="navbar rounded-2xl bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Web3 Fullstack Starter</a>
      </div>
      <div className="flex gap-2">
        <CreateBallot />
        <Connect />
      </div>
    </div>
  );
}
