import type { RequestHandler } from "express"

const AuthMiddleware: RequestHandler = (req, res, next) => {
  
  
  next()
}