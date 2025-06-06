import { Request, Response, NextFunction } from 'express';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { fullName, email, password, confirmPassword  } = req.body as {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
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

  if (!confirmPassword || typeof confirmPassword !== 'string') {
    res.status(400).json({ message: 'Vui lòng nhập lại mật khẩu!' });
    return;
  }
  if (confirmPassword !== password) {
    res.status(400).json({ message: 'Mật khẩu nhập lại không khớp!' });
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