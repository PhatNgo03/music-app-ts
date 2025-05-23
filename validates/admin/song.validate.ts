import { Request, Response, NextFunction } from "express";

const validate: any = {};

validate.create = async (req: Request, res: Response, next: NextFunction) => {
  const { title, avatar, description, audio, position } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Vui lòng nhập tiêu đề bài hát!" });
  }

  if (!avatar || typeof avatar !== "string") {
    return res.status(400).json({ message: "Ảnh đại diện không hợp lệ!" });
  }

  if (!description || description.trim() === "") {
    return res.status(400).json({ message: "Vui lòng nhập mô tả bài hát!" });
  }

  if (!audio || typeof audio !== "string") {
    return res.status(400).json({ message: "File audio không hợp lệ!" });
  }

  if (position !== undefined && isNaN(Number(position))) {
    return res.status(400).json({ message: "Vị trí phải là số!" });
  }

  next();
};

validate.edit = async (req: Request, res: Response, next: NextFunction) => {
  const { title, avatar, description, singerId, topicId, audio, position } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Vui lòng nhập tiêu đề bài hát!" });
  }

  if (!avatar || typeof avatar !== "string") {
    return res.status(400).json({ message: "Ảnh đại diện không hợp lệ!" });
  }

  if (!description || description.trim() === "") {
    return res.status(400).json({ message: "Vui lòng nhập mô tả bài hát!" });
  }


  if (!audio || typeof audio !== "string") {
    return res.status(400).json({ message: "File audio không hợp lệ!" });
  }

  if (position !== undefined && isNaN(Number(position))) {
    return res.status(400).json({ message: "Vị trí phải là số!" });
  }

  next();
};

export default validate;
