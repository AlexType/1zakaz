import { z } from "zod";
import { normalizeRussianPhone } from "@/shared/lib/normalize-russian-phone";

const email = z.email({ error: "Укажите корректную почту" });

export const emailSchema = z.object({ email });

const phone = z
  .string()
  .refine((value) => normalizeRussianPhone(value) !== null, {
    error: "Укажите номер в формате +7 999 123-45-67",
  });

export const passwordSchema = z.object({
  phone,
  password: z.string().min(1, { error: "Введите пароль" }),
});

export const invitationSchema = z.object({
  fullName: z.string().trim().min(3, { error: "Укажите имя и фамилию" }),
  email,
  phone,
});
