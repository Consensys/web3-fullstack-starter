import { z } from "zod";

export const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    choices: z
      .array(z.object({ value: z.string().min(1, "Choice is required") }))
      .min(1, "At least one choice is required"),
  });