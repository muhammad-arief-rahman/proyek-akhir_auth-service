import type { RequestHandler } from "express"
import { internalServerError, response } from "../../../lib/common"
import prisma from "../../../lib/db"
import generateUserToken from "../utils/generate-user-token"
import { REFRESH_TOKEN_DURATION } from "../../../lib/constants"
import getSession from "../utils/get-session"

export const refresh: RequestHandler = async (req, res) => {
  try {
    const session = await getSession(req, res)

    if (!session) {
      response(res, 401, "Invalid refresh token")
      return
    }

    if (session.expiresAt < new Date()) {
      response(res, 401, "Refresh token expired")
      return
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
    })

    if (!user) {
      response(res, 401, "Invalid user")
      return
    }

    // Refresh token
    await prisma.userSession.delete({
      where: {
        id: session.id,
      },
    })

    const newSession = await prisma.userSession.create({
      data: {
        userId: user.id,
        token: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_DURATION),
      },
    })

    response(res, 200, "Token refreshed", {
      token: await generateUserToken(user),
      refreshToken: newSession.token,
    })
  } catch (e) {
    internalServerError(res)
  }
}

export default refresh
