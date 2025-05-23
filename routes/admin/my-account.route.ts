import { Router } from "express";
import * as controller from "../../controller/admin/my-account.controller";
import validate from "../../validates/admin/account.validate";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
import multer from "multer";
const uploadMiddleware = multer(); 
const router: Router = Router();


router.get("/", controller.index);
router.get("/edit", controller.edit);
router.patch(
  "/edit",
  uploadMiddleware.single("avatar"),
  uploadCloud.upload,
  controller.editPatch,
  );
export const myAccountRouters : Router = router; 