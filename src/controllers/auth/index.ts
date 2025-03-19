import check from "./routes/check"
import login from "./routes/login"
import logout from "./routes/logout"
import refresh from "./routes/refresh"

const AuthController = {
  login,
  refresh,
  logout,
  check,
}

export default AuthController
