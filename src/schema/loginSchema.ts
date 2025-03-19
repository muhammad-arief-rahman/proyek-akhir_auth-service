import { z } from "zod"

const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email harus diisi",
      invalid_type_error: "Email harus berupa string",
    })
    .email("Email tidak valid"),
  password: z
    .string({
      required_error: "Password harus diisi",
      invalid_type_error: "Password harus berupa string",
    })
    .min(8, "Password minimal 8 karakter"),
})

export type LoginInput = z.infer<typeof loginSchema>

export default loginSchema