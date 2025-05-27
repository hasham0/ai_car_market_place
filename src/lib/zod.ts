import { z } from "zod";

export const generateImageSchema = z.object({
  description: z
    .string()
    .min(5, "Description must be at least 5 characters long"),
  name: z.string().min(3, "File name is required"),
});

export type GenerateImageSchemaTS = z.infer<typeof generateImageSchema>;
