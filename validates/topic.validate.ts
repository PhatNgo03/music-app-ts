import { Request, Response, NextFunction } from "express";

const validate: any = {};

validate.create = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.title) {
    return res.status(400).json({ message: "Vui lòng nhập tiêu đề!" });
  }
  next();
};

export default validate;
