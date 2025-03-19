// * COMMON UTILITIES ACROSS SERVICES

import type { RequestHandler } from "express"
import { ZodError } from "zod"

export function internalServerError(res: Parameters<RequestHandler>[1], error?: any) {
  return res.status(500).json({ message: "Internal server error", error: error })
}

export function zodHandler(error: ZodError) {
  return error.errors.reduce((acc, curr) => {
    curr.path.forEach((path, index) => {
      if (!acc[path]) {
        acc[path] = []
      }

      if (index === curr.path.length - 1) {
        acc[path].push(curr.message)
      }
    })

    return acc
  }, {} as Record<string, string[]>)
}

export function zodCatchHandler(
  error: unknown,
  res: Parameters<RequestHandler>[1],
  message = "Validation error"
) {
  if (error instanceof ZodError) {
    res.status(422).json({ message, errors: zodHandler(error) })
  }
}

export function response(
  res: Parameters<RequestHandler>[1],
  status = 200,
  message: string,
  data: any = null
) {
  if (status >= 200 && status < 400) {
    return res.status(status).json({ status, message, data })
  } else {
    return res.status(status).json({ status, message, error: data })
  }
}