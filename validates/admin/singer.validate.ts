import { Request, Response, NextFunction } from "express";

const validate: any = {};

validate.create = async  (req: Request, res: Response, next: NextFunction) => {
    const { fullName, avatar } = req.body;

  // Validate fullName
  if (!fullName || fullName.trim() === "") {
    return res.status(400).json({ message: "Vui lòng nhập họ tên!" });
  }

  // Validate avatar
  if (!avatar || typeof avatar !== "string") {
    return res.status(400).json({ message: "Avatar không hợp lệ!" });
  }

  next();
};

validate.edit = async (req: Request, res: Response, next: NextFunction) => {
  const { fullName } = req.body;

  // Validate fullName
  if (!fullName || fullName.trim() === "") {
    return res.status(400).json({ message: "Vui lòng nhập họ tên!" });
  }

  next();
};

export default validate;
