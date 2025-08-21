import { z } from "zod";

export const loginUserSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  //   password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const registerUserSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email" }),
  phone: z.string().regex(/^[0-9]{8}$/, { message: "Phone must be 8 digits" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});
