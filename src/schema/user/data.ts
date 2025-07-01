import { z } from "zod"

export const userDataSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(1, "Phone number is required"),
    avatar: z
      .any()
      .refine((val) => !val || val instanceof File, {
        message: "Image must be a file",
      })
      .refine((val) => !val || val?.type?.startsWith?.("image/"), {
        message: "Image must be of type image/*",
      })
      .optional(),
    password: z
      .string()
      .refine((val) => !val || val.length >= 6, {
        message: "Password must be at least 6 characters long",
      })
      .optional(),
    confirmPassword: z
      .string()
      .refine((val) => !val || val.length >= 6, {
        message: "Confirm password must be at least 6 characters long",
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.confirmPassword) {
        return data.password === data.confirmPassword
      }
      return true
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  )

export const userDataPatchSchema = userDataSchema

export type UserData = z.infer<typeof userDataSchema>
export type UserDataPatch = z.infer<typeof userDataPatchSchema>
