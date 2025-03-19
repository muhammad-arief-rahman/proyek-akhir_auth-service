import type { User } from "@prisma/client"
import { generateJwtToken } from "../../../lib/utils"

export default async function generateUserToken(user: User) {
  return await generateJwtToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
}
