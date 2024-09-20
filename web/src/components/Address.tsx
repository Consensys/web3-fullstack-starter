import { useAccount } from "wagmi";

export function Address() {
  const { address } = useAccount();

  if (!address) return null;

  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm font-medium">
      {truncatedAddress}
    </div>
  );
}