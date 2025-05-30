import { Request, Response } from "express";
import Topic from "../../models/topic.model";

// [GET] /topics/
export const topics = async (req: Request, res: Response) => {
  try {
    const topics = await Topic.find({ deleted: false });


    res.render("client/pages/topics/index", {
      pageTitle: "Chủ đề bài hát ",
      topics: topics
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
};
