import { Request, Response, NextFunction } from "express";

const validate: any = {};

validate.create = (req: Request, res: Response, next: NextFunction) => {
  const { title, status, position } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Vui lòng nhập tiêu đề!" });
  }

  const validStatuses = ["active", "inactive"];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: "Trạng thái không hợp lệ!" });
  }

  if (position === undefined || isNaN(position) || Number(position) < 0) {
    return res.status(400).json({ message: "Vị trí không hợp lệ!" });
  }

  next();
};

export default validate;
