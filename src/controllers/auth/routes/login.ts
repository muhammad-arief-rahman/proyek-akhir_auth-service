import bcrypt from "bcrypt"
import type { RequestHandler } from "express"
import {
  internalServerError,
  response,
  zodCatchHandler,
} from "@ariefrahman39/shared-utils"
import { REFRESH_TOKEN_DURATION } from "../../../lib/constants"
import prisma from "../../../lib/db"
import loginSchema from "../../../schema/loginSchema"
import generateUserToken from "../utils/generate-user-token"
import axios from "axios"
import { getCustomerByUserId } from "../../../helpers"

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

    // Only allow 5 sessions per user
    const userSessions = await prisma.userSession.count({
      where: {
        userId: user.id,
      },
    })

    if (userSessions >= 5) {
      // Delete the oldest session
      const oldestSession = await prisma.userSession.findFirst({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: "asc",
        },
      })

      if (oldestSession) {
        await prisma.userSession.delete({
          where: {
            id: oldestSession.id,
          },
        })
      }
    }

    // Create new sessions
    const session = await prisma.userSession.create({
      data: {
        userId: user.id,
        token: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_DURATION),
      },
    })

    // Fetch customer by User Id
    const customerId = (await getCustomerByUserId(user.id))?.id

    response(res, 200, "Login successful", {
      token: await generateUserToken(user, customerId),
      refreshToken: session.token,
    })
  } catch (error) {
    zodCatchHandler(error, res)
    internalServerError(res)
  }
}

export default login
