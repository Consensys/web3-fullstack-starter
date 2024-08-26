import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useBallots } from "../hooks/useBallots";

export const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  choices: z
    .array(z.object({ value: z.string().min(1, "Choice is required") }))
    .min(1, "At least one choice is required"),
});

export function CreateBallot() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      choices: [{ value: "" }],
    },
    mode: "onChange",
  });

  const { fields: choices, append } = useFieldArray({
    control,
    name: "choices",
  });
  const { createBallot, error, isPending, isConfirming, isConfirmed } =
    useBallots();

  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const openDialog = () => {
    if (dialogRef.current) dialogRef.current.showModal();
  };

  const closeDialog = () => {
    if (dialogRef.current) dialogRef.current.close();
  };

  useEffect(() => {
    if (isConfirmed) {
      closeDialog();
    }
  }, [isConfirmed]);

  return (
    <>
      <button className="btn" onClick={openDialog}>
        Create a new ballot
      </button>
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create a new ballot</h3>
          <div className="modal-action">
            <form
              onSubmit={handleSubmit(createBallot)}
              method="dialog"
              className="w-full space-y-2"
            >
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Title</span>
                </div>
                <input
                  type="text"
                  placeholder="Type here"
                  {...register("title")}
                  className="input input-bordered w-full"
                />
                {errors.title && (
                  <div className="label">
                    <span className="label-text-alt text-red-500">
                      {errors.title.message}
                    </span>
                  </div>
                )}
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Description</span>
                </div>
                {errors.description && (
                  <div className="label">
                    <span className="label-text-alt text-red-500">
                      {errors.description.message}
                    </span>
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Type here"
                  {...register("description")}
                  className="input input-bordered w-full"
                />
              </label>

              {choices.map((_, index) => (
                <label className="form-control w-full flex">
                  <div className="label">
                    <span className="label-text">Choice {index + 1}</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type here"
                      {...register(`choices.${index}.value` as const)}
                      className="input input-bordered grow"
                    />
                    {index > 0 && <button className="btn btn-square">X</button>}
                  </div>
                  {errors.choices?.[index] && (
                    <div className="label">
                      <span className="label-text-alt text-red-500">
                        {errors.choices?.[index]?.value?.message}
                      </span>
                    </div>
                  )}
                </label>
              ))}

              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => append({ value: "" })}
              >
                add a new choice
              </button>

              <div className="modal-action">
                <button onClick={closeDialog} className="btn btn-outline">
                  Close
                </button>

                <button type="submit" className="btn">
                  {(isPending || isConfirming) && (
                    <span className="loading loading-spinner text-primary"></span>
                  )}
                  Create
                </button>
              </div>
              {error ? <p className="text-red-500">{error.message}</p> : null}
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
