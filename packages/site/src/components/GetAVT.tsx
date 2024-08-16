import { useAvt } from "../hooks/useAvt";
import { SvgCard } from "./SvgCard";
import { useRef, useState } from "react";

interface GetAvtProps {
  ballotId: bigint;
}

export const GetAvt = ({ ballotId }: GetAvtProps) => {
  const [selectedToken, setSelectedToken] = useState<null | bigint>(null);
  const [isCopied, setIsCopied] = useState(false);

  const {
    nftsWithAvt,
    getAvt,
    newAvt,
    refetchData,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  } = useAvt();

  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const openDialog = () => {
    if (dialogRef.current) dialogRef.current.showModal();
  };

  const closeDialog = () => {
    if (dialogRef.current) dialogRef.current.close();
    refetchData();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const tokensWithoutAvt =
    nftsWithAvt?.filter((token) => !token.avt.isIssued) || [];

  return (
    <div className="w-full">
      <button className="btn w-full" onClick={openDialog}>
        Get a AVT
      </button>

      <dialog id="nft-list-modal" ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Generate a AVT (Anonymous Voting Token)
          </h3>
          <div className="flex items-center my-2">
            <span>
              Use an NFT that you own to generate the AVT. Please store the AVT
              securely, as it will be required for voting
            </span>
          </div>

          <div className="w-full">
            <div className="grid grid-cols-4 grid-rows-2 gap-2">
              {tokensWithoutAvt.map((token, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setSelectedToken((prevSelected) =>
                      prevSelected === token.tokenId ? null : token.tokenId
                    )
                  }
                  className="border-secondary border-2 rounded-lg p-1 w-full h-full"
                >
                  <div className="bg-base-300 grid place-items-center">
                    <SvgCard token={token} />
                  </div>
                </button>
              ))}
            </div>
          </div>
          {newAvt !== undefined && (
            <button
              onClick={() => copyToClipboard(newAvt.toString())}
              role="alert"
              className="alert alert-success mt-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium">
                {" "}
                {isCopied
                  ? "Copied"
                  : "AVT generated Successfully! Click to copy"}
              </span>
            </button>
          )}

          <div className="modal-action">
            <button onClick={closeDialog} className="btn btn-outline">
              Close
            </button>

            {selectedToken !== null ? (
              <button
                className="btn "
                onClick={() => getAvt(selectedToken, ballotId)}
              >
                {(isPending || isConfirming) && (
                  <span className="loading  loading-spinner text-primary"></span>
                )}
                Get one time token
              </button>
            ) : null}
          </div>
          <div className="mt-2">
            {error ? <p className="text-red-500">{error.message}</p> : null}
            {isConfirmed && newAvt === undefined ? (
              <p className="">
                Please do not close this dialog until you see the generated AVT
              </p>
            ) : null}
          </div>
        </div>
      </dialog>

      <p className="text-xs text-orange-500">
        you do not own a NFT for eligibility. Please mint one.
      </p>
    </div>
  );
};
