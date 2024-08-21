import { useNfts } from "../hooks/useNfts";
import { SvgCard } from "./SvgCard";
import { useRef } from "react";

export const MyNFTs = () => {
  const { nfts, mintNft, isPending, isConfirming, error } =
    useNfts();

  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const openDialog = () => {
    if (dialogRef.current) dialogRef.current.showModal();
  };

  return (
    <>
      <button
        className="btn btn-primary w-1/2 justify-self-center"
        onClick={openDialog}
      >
        <span className="font-medium text-white">My NFTs</span>
      </button>

      <dialog id="nft-list-modal" ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Your NFTs</h3>
          {nfts && nfts.length > 0 ? (
            <>
              <div className="my-5">
                <span> You have {nfts.length} NFT/s. </span>
                <span className="">
                  You will see the ballot ID if the NFT has already been used to
                  create an AVT
                </span>
              </div>

              <div className="grid grid-cols-4 grid-rows-2 gap-4">
                {nfts.map((token) => {
                  const linkedAvt = token.avt.isIssued ? token.avt : null;
                  return (
                    <div
                      key={token.tokenId}
                      className="indicator w-full h-full"
                    >
                      {linkedAvt ? (
                        <span className="indicator-item indicator-center badge badge-primary">
                          Ballot #{linkedAvt.ballotId.toString()}
                        </span>
                      ) : null}

                      <SvgCard token={token} />
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div>
              <h3 className="font-bold text-lg">You dont have any NFTs yet</h3>
            </div>
          )}

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button, it will close the modal */}
              <button className="btn">Close</button>
            </form>
            <button className="btn btn-primary" onClick={mintNft}>
              {(isPending || isConfirming) && (
                <span className="loading  loading-spinner text-accent"></span>
              )}
              Mint
            </button>
          </div>
          <div className="mt-2">
            {error ? <p className="text-red-500">{error.message}</p> : null}
          </div>
        </div>
      </dialog>
    </>
  );
};
