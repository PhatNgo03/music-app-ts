import { Router } from "express";
import * as controller from "../../controller/admin/setting.controller";
import validate from "../../validates/admin/setting.validate";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
import multer from "multer";
const uploadMiddleware = multer(); 
const router: Router = Router();


router.get("/general", controller.general);
router.patch(
  "/general",
  uploadMiddleware.single("logo"),
  uploadCloud.upload,
  validate.create,
  controller.generalPatch);

export const settingRoutes : Router = router;