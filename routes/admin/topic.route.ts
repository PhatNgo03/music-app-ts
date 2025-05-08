import { Router } from "express";
import multer from "multer";
import * as controller from "../../controller/admin/topic.controller";
import validate from "../../validates/topic.validate";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
const router: Router = Router();
const uploadMiddleware = multer(); 

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  uploadMiddleware.single("avatar"), 
  uploadCloud.upload,
  // validate.createPost,
  controller.createPost
);

export const topicRoutes: Router = router;
