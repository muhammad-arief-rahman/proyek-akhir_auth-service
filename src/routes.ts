import { Router } from "express"
import AuthController from "./controllers/auth"
import { AuthMiddleware, response } from "@ariefrahman39/shared-utils"
import UserController from "./controllers/user"

const router = Router()
const authenticated = Router().use(AuthMiddleware.authenticate())

router.get("/", (req, res) => {
  response(res, 200, "Auth Service is running")
})

router.post("/login", AuthController.login)
router.post("/refresh", AuthController.refresh)
router.post("/logout", AuthController.logout)
router.post(
  "/check",
  // AuthMiddleware.authenticate("admin"),
  AuthController.check
)

router.get(
  "/users",
  AuthMiddleware.authenticate("admin"),
  UserController.getAll
)

router.post(
  "/users",
  AuthMiddleware.authenticate("admin"),
  UserController.store
)

authenticated.patch("/users/:id", UserController.patch)
authenticated.get("/users/:id", UserController.getById)

router.use(authenticated)

export default router
