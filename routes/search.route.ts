import { Router } from "express";

import * as controller from "../controller/client/search.controller";

const router: Router = Router();

router.get("/result", controller.result);

export const searchRoutes: Router = router;