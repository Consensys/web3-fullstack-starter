import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useCallback, useEffect } from "react";
import { useBallots } from "@/hooks/useBallots";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formSchema } from "@/lib/formSchema";
import { formatErrorMessage } from "@/lib/formatError";

export function CreateBallot() {
  const [open, setOpen] = useState(false);
  const {
    createBallot,
    error,
    isPending,
    isConfirming,
    isConfirmed,
    resetBallotState,
  } = useBallots();

  const {
    register,
    handleSubmit,
    control,
    reset,
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

  const {
    fields: choices,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "choices",
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await createBallot(data);
  };

  const resetForm = useCallback(() => {
    reset({
      title: "",
      description: "",
      choices: [{ value: "" }],
    });
  }, [reset]);

  useEffect(() => {
    if (isConfirmed) {
      setOpen(false);
      resetBallotState();
      resetForm();
    }
  }, [isConfirmed, resetForm, resetBallotState]);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen);
      if (!newOpen) {
        resetForm();
        resetBallotState();
      }
    },
    [resetForm, resetBallotState]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Create a new ballot</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create a new ballot</DialogTitle>
          <DialogDescription>
            Fill in the details for your new ballot. Click create when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                rows={3}
                className="resize-none"
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            {choices.map((field, index) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={`choice-${index}`}>Choice {index + 1}</Label>
                <div className="flex space-x-2">
                  <Input
                    id={`choice-${index}`}
                    {...register(`choices.${index}.value` as const)}
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {errors.choices?.[index] && (
                  <p className="text-sm text-destructive">
                    {errors.choices[index]?.value?.message}
                  </p>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ value: "" })}
            >
              Add a new choice
            </Button>
          </form>
        </ScrollArea>
        <div className="mt-4">
          <DialogFooter className="flex justify-between">
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isPending || isConfirming}
            >
              {(isPending || isConfirming) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create
            </Button>
          </DialogFooter>
          {error && (
            <p className="text-destructive text-sm mt-2 break-words">
              {formatErrorMessage(error)}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
