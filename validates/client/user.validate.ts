import { Request, Response, NextFunction } from 'express';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { fullName, email, password } = req.body as {
    fullName: string;
    email: string;
    password: string;
  };

  if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
    res.status(400).json({ message: 'Vui lòng nhập họ và tên!' });
    return;
  }
  if (fullName.trim().length < 3) {
    res.status(400).json({ message: 'Họ và tên phải có ít nhất 3 ký tự!' });
    return;
  }
  if (fullName.trim().length > 50) {
    res.status(400).json({ message: 'Họ và tên tối đa 50 ký tự!' });
    return;
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    res.status(400).json({ message: 'Vui lòng nhập email!' });
    return;
  }
  if (!emailRegex.test(email.trim())) {
    res.status(400).json({ message: 'Email không hợp lệ!' });
    return;
  }

  if (!password || typeof password !== 'string') {
    res.status(400).json({ message: 'Vui lòng nhập mật khẩu!' });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự!' });
    return;
  }
  if (password.length > 30) {
    res.status(400).json({ message: 'Mật khẩu tối đa 30 ký tự!' });
    return;
  }

  next();
};


export const login = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;

  // Kiểm tra xem email có tồn tại không và có định dạng hợp lệ không
  if (!email || typeof email !== 'string' || !email.trim()) {
    res.status(400).json({ message: 'Vui lòng nhập email!' });
    return;
  }
  if (!emailRegex.test(email.trim())) {
    res.status(400).json({ message: 'Email không hợp lệ!' });
    return;
  }

  // Kiểm tra xem password có tồn tại không và có độ dài hợp lý không
  if (!password || typeof password !== 'string') {
   res.status(400).json({ message: 'Vui lòng nhập mật khẩu!' });
   return;
  }
  if (password.length < 6) {
    res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự!' });
    return;
  }
  if (password.length > 30) {
    res.status(400).json({ message: 'Mật khẩu tối đa 30 ký tự!' });
    return;
  }
  // Nếu tất cả đều hợp lệ, chuyển sang tiếp theo
  next();
};