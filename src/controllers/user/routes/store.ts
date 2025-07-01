import type { RequestHandler } from "express"
import { userDataSchema } from "../../../schema/user/data"
import axios from "axios"
import prisma from "../../../lib/db"
import bcrypt from "bcrypt"
import { internalServerError, response } from "@ariefrahman39/shared-utils"

const store: RequestHandler = async (req, res) => {
  try {
    // console.log("Files in request:", req.files)
    const parsedData = userDataSchema.parse({
      ...req.body,
      avatar: ((req.files as Express.Multer.File[]) ?? [])?.find(
        (file) => file.fieldname === "image"
      ),
    })

    let avatar: string | null = null

    // If the avatar is provided, it will be processed to the media service
    if (parsedData.avatar) {
      const formData = new FormData()

      const fileBlob = new Blob([parsedData.avatar.buffer], {
        type: parsedData.avatar.mimetype,
      })

      formData.set("file", fileBlob, parsedData.avatar.originalname)

      const response = await axios.post(
        `${process.env.MEDIA_SERVICE_URL}/data`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      const mediaId = response.data?.data?.[0]

      if (mediaId) {
        avatar = mediaId
      }
    }

    const updatedUser = await prisma.user.create({
      data: {
        name: parsedData.name,
        email: parsedData.email,
        phone: parsedData.phone,
        password: await bcrypt.hash(parsedData.password, 10),
        avatar: avatar,
      },
    })

    response(res, 200, "User created successfully", updatedUser)
  } catch (error) {
    console.error("Error in create user controller:", error)

    internalServerError(res, error)
  }
}

export default store
