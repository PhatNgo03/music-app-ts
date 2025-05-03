import { Router, Request, Response } from "express";
import Topic from "../models/topic.model";

const router: Router = Router();

router.get("/topics", async (req: Request, res: Response) => {
  const topics = await Topic.find({
    deleted : false
  });

  console.log(topics);
  
  res.render("client/pages/topics/index.pug");
});

export const topicRoutes: Router = router;