import { useState } from "react";
import { Connect } from "./ConnectButton";
import { CreateBallot } from "./CreateBallot";
import { Address } from "./Address";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="text-xl font-semibold text-foreground hover:text-primary transition-colors duration-200">
            Web3 Fullstack Starter
          </a>
          <div className="hidden md:flex items-center space-x-4">
            <CreateBallot />
            <Address />
            <Connect />
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="flex flex-col space-y-2">
              <CreateBallot />
              <Address />
              <Connect />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
