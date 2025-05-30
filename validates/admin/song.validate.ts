import { Request, Response, NextFunction } from "express";

const validate: any = {};

validate.create = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, position, lyrics } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Vui lòng nhập tiêu đề bài hát!" });
  }

  if (!description || description.trim() === "") {
    return res.status(400).json({ message: "Vui lòng nhập mô tả bài hát!" });
  }

  if (!lyrics || lyrics.trim() === "") {
    return res.status(400).json({ message: "Vui lòng nhập lời bài hát!" });
  }

  if (position !== undefined && isNaN(Number(position))) {
    return res.status(400).json({ message: "Vị trí phải là số!" });
  }

  next();
};

validate.edit = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, lyrics, position } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Vui lòng nhập tiêu đề bài hát!" });
  }

  if (!description || description.trim() === "") {
    return res.status(400).json({ message: "Vui lòng nhập mô tả bài hát!" });
  }

  if (!lyrics || lyrics.trim() === "") {
    return res.status(400).json({ message: "Vui lòng nhập lời bài hát!" });
  }

  if (position !== undefined && isNaN(Number(position))) {
    return res.status(400).json({ message: "Vị trí phải là số!" });
  }

  next();
};

export default validate;
