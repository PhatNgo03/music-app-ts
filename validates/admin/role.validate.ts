import { Request, Response, NextFunction } from "express";

const validate: any = {};

validate.create = async (req: Request, res: Response, next: NextFunction) => {
  const { title } = req.body;

  // Validate title
  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Vui lòng nhập tên vai trò!" });
  }

  next();
};

validate.edit = async (req: Request, res: Response, next: NextFunction) => {
  const { title } = req.body;

  if (title && title.trim() === "") {
    return res.status(400).json({ message: "Tên vai trò không được để trống!" });
  }
  next();
};

export default validate;
