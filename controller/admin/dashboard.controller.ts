import { Request, Response } from "express";

// [GET] /admin/dashboard
export const index = async (req: Request, res: Response) => {
  try {
    res.render("admin/pages/dashboard/index", {
        pageTitle: "Tổng quan ",
      });
  } catch (error) {
    res.status(500).send("Server error");
  }
};
