import { z } from "zod";

export const contactInformationSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  location: z.string().optional(),
  cv: z.string().optional(),
});