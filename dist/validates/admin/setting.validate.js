"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const validate = {};
validate.create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.default = validate;
