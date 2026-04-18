import { z } from "zod";

export const ProfileSchema = z.object({
  full_name: z.string().min(2, "Imię jest za krótkie").max(50),
  username: z.string().min(3, "Username musi mieć min. 3 znaki").regex(/^[a-zA-Z0-9_]+$/, "Tylko litery, cyfry i podkreślniki"),
});