import {  useRef } from "react";

export const Results = ({
  title,
  choices,
  results,
}: {
  title: string;
  choices: readonly string[];
  results: undefined | readonly bigint[];
}) => {
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
        Reveal results
      </button>

      <dialog id="choices-modal" ref={dialogRef} className="modal">
        <div className="modal-box min-h-[350px]">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="py-4">Here are the number of votes that each choice has received</p>

          <div className="flex flex-col gap-2">
            {choices.map((choice, index) => (
              <div className="w-full flex bg-primary px-2 py-4 rounded-md justify-between">
                {choice}

                <div className="badge badge-secondary ">
                  {results?.[index].toString()}
                </div>
              </div>
            ))}
          </div>

          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button
              onClick={closeDialog}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};
