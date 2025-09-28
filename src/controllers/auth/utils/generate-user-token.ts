import type { User } from "@prisma/client"
import { generateJwt } from "../../../lib/utils"

export default async function generateUserToken(user: User, customerId?: string | null) {
  return await generateJwt({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    customerId: customerId ?? null,
  })
}
