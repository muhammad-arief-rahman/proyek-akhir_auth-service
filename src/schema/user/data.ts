import { z } from "zod"

export const userDataSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(1, "Phone number is required"),
    avatar: z
      .custom<Express.Multer.File>(
        (file) => {
          return (
            file &&
            typeof file === "object" &&
            "fieldname" in file &&
            "originalname" in file &&
            "mimetype" in file &&
            "size" in file &&
            typeof file.fieldname === "string" &&
            typeof file.originalname === "string" &&
            typeof file.mimetype === "string" &&
            typeof file.size === "number"
          )
        },
        {
          message: "File must be a valid multer file",
        }
      )
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
