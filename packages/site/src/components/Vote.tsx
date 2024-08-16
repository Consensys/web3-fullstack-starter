import { useRef, useState } from "react";
import { cn } from "../../utils/cn";
import { useVoting } from "../hooks/useVoting";

export const Vote = ({
  title,
  ballotId,
  tokenId,
  choices,
}: {
  title: string;
  ballotId: bigint;
  tokenId: bigint;
  choices: readonly string[];
}) => {
  const [selectedChoice, setSelectedChoice] = useState<number>();
  const [avt, setAvt] = useState<string | undefined>(undefined);
  const [currentStep, setCurrentStep] = useState(0);

  const { castBallot, error, isPending, isConfirming } = useVoting();

  function vote() {
    if (selectedChoice === undefined || !avt) {
      return;
    }

    castBallot(ballotId, tokenId, BigInt(avt), BigInt(selectedChoice));
  }

  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const openDialog = () => {
    if (dialogRef.current) dialogRef.current.showModal();
  };

  const closeDialog = () => {
    if (dialogRef.current) dialogRef.current.close();
  };

  return (
    <>
      <button className="btn w-full" onClick={openDialog}>
        Vote
      </button>
      <dialog id="choices-modal" ref={dialogRef} className="modal">
        <div className="modal-box ">
          {currentStep === 0 && (
            <div className="flex flex-col">
              <h3 className="font-bold text-lg">{title}</h3>
              <p className="py-4">
                Paste the AVT for the Ballot#{ballotId.toString()} to start
              </p>
              <div className="w-full">
                <textarea
                  rows={6}
                  placeholder="Paste your AVT here"
                  value={avt}
                  onChange={(e) => setAvt(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="modal-action">
                <button
                  onClick={closeDialog}
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
                  ✕
                </button>
                {avt ? (
                  <button className="btn" onClick={() => setCurrentStep(1)}>
                    Next
                  </button>
                ) : null}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <>
              <h3 className="font-bold text-lg">{title}</h3>
              <p className="py-4">Pick a choice</p>

              <div className="flex flex-col gap-2">
                {choices.map((choice, index) => (
                  <button
                    onClick={() => setSelectedChoice(index)}
                    className={cn(
                      "btn flex justify-between btn-info",
                      selectedChoice === index ? "btn" : "btn-outline"
                    )}
                    key={index}
                  >
                    {choice}
                  </button>
                ))}
              </div>

              <div className="modal-action">
                <button
                  onClick={closeDialog}
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
                  ✕
                </button>

                <button className="btn" onClick={vote}>
                  {(isPending || isConfirming) && (
                    <span className="loading  loading-spinner text-primary"></span>
                  )}
                  Vote
                </button>
              </div>
              {error ? <p className="text-red-500">{error.message}</p> : null}
            </>
          )}
        </div>
      </dialog>
    </>
  );
};
