import { Router } from "express";
import * as controller from "../../controller/admin/upload.controller";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
import multer from "multer";
const uploadMiddleware = multer(); 
const router: Router = Router();


router.post("/",
  uploadMiddleware.single("file"),
  uploadCloud.upload, 
  controller.index);



export const uploadRoutes : Router = router;