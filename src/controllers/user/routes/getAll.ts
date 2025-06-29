import { internalServerError, response } from "@ariefrahman39/shared-utils"
import type { RequestHandler } from "express"
import prisma from "../../../lib/db"

const getAll: RequestHandler = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      
    })

    response(res, 200, "Users retrieved successfully", users)
  } catch (error) {
    internalServerError(res, error)
  }
}

export default getAll