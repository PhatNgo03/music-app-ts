import { Request, Response, NextFunction } from "express";
import Account from "../../models/account.model";

const validate: any = {};

validate.create = async  (req: Request, res: Response, next: NextFunction) => {
    const { fullName, email, password, phone, avatar } = req.body;

  // Validate fullName
  if (!fullName || fullName.trim() === "") {
    return res.status(400).json({ message: "Vui lòng nhập họ tên!" });
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Email không hợp lệ!" });
  }

  // Check email already exists
  try {
  const existingAccount = await Account.findOne({ email });
  if (existingAccount) {
    return res.status(400).json({ message: "Email đã tồn tại!" });
  }
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server!" });
  }


  // Validate password
  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự!" });
  }

  // Validate phone
  const phoneRegex = /^[0-9]{10}$/;
  if (!phone || !phoneRegex.test(phone)) {
    return res.status(400).json({ message: "Số điện thoại không hợp lệ!" });
  }

  // Validate avatar
  if (!avatar || typeof avatar !== "string") {
    return res.status(400).json({ message: "Avatar không hợp lệ!" });
  }

  next();
};

export default validate;
