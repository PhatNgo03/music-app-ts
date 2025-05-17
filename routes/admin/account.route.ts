import { Router } from "express";
import * as controller from "../../controller/admin/account.controller";
import validate from "../../validates/admin/account.validate";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
import multer from "multer";
const uploadMiddleware = multer(); 
const router: Router = Router();


router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create",
  uploadMiddleware.single("avatar"),
  uploadCloud.upload,
  validate.create,
  controller.createPost
)

export const accountRoutes : Router = router;