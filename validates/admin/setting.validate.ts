import { Request, Response, NextFunction } from "express";

const validate: any = {};

validate.create = async (req: Request, res: Response, next: NextFunction) => {
  const { websiteName, phone, email, address, copyright } = req.body;

  if (!websiteName || websiteName.trim() === "") {
    return res.status(400).json({ message: "Vui lòng nhập tên website!" });
  }

  if (!phone || phone.trim() === "") {
    return res.status(400).json({ message: "Vui lòng nhập số điện thoại!" });
  }

  if (!email || email.trim() === "") {
    return res.status(400).json({ message: "Vui lòng nhập email!" });
  }

  // Kiểm tra email định dạng cơ bản
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Email không hợp lệ!" });
  }

  if (!address || address.trim() === "") {
    return res.status(400).json({ message: "Vui lòng nhập địa chỉ!" });
  }

  if (!copyright || copyright.trim() === "") {
    return res.status(400).json({ message: "Vui lòng nhập thông tin bản quyền!" });
  }

  next();
};

export default validate;