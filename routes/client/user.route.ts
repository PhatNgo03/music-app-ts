import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controller/client/user.controller";
import * as validate from "../../validates/client/user.validate";

router.get("/register", controller.register);

router.post("/register", validate.register, controller.registerPost);

router.get("/login", controller.login);

router.post("/login", validate.login, controller.loginPost);

router.get("/logout", controller.logout);

export const userRoutes : Router = router;