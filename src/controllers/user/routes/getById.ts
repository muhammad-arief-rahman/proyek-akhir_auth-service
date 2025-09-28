import { internalServerError, response } from "@ariefrahman39/shared-utils"
import type { RequestHandler } from "express"
import prisma from "../../../lib/db"

const show: RequestHandler = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      if (req.user?.id !== req.params.id) {
        response(res, 403, "Forbidden: You can only access your own data")
        return
      }
    }
    
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id
      }
    })

    if (!user) {
      response(res, 404, "User not found")
      return
    }

    response(res, 200, "User retrieved successfully", user)
  } catch (error) {
    internalServerError(res, error)
  }
}

export default show