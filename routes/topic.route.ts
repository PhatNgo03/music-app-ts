import { Router } from "express";

import * as controller from "../controller/client/topic.controller";

const router: Router = Router();

router.get("/", controller.topics);

export const topicRoutes: Router = router;