import bcrypt from "bcrypt"
import type { RequestHandler } from "express"
import {
  internalServerError,
  response,
  zodCatchHandler,
} from "../../../lib/common"
import { REFRESH_TOKEN_DURATION } from "../../../lib/constants"
import prisma from "../../../lib/db"
import loginSchema from "../../../schema/loginSchema"
import generateUserToken from "../utils/generate-user-token"

const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body)

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (!user) {
      response(res, 401, "Email or Password is incorrect")
      return
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      response(res, 401, "Email or Password is incorrect")
      return
    }

    // Delete old sessions
    await prisma.userSession.deleteMany({
      where: {
        userId: user.id,
      },
    })

    // Create new sessions
    const session = await prisma.userSession.create({
      data: {
        userId: user.id,
        token: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_DURATION),
      },
    })

    response(res, 200, "Login successful", {
      token: await generateUserToken(user),
      refreshToken: session.token,
    })
  } catch (error) {
    zodCatchHandler(error, res)
    internalServerError(res)
  }
}

export default login
